const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const { nanoid } = require('nanoid');
const { upload, cloudinary, uploadToCloudinary } = require('../config/cloudinary');
const File = require('../models/File');
const User = require('../models/User');
const { protect, optionalAuth } = require('../middleware/auth');

// @POST /api/files/upload
router.post('/upload', optionalAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { description, tags, password, expiresIn, maxDownloads, isPublic } = req.body;
    const shortCode = nanoid(8);

    // Upload to Cloudinary
    const cloudResult = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    let hashedPassword = null;
    if (password) hashedPassword = await bcrypt.hash(password, 10);

    let expiresAt = null;
    if (expiresIn && expiresIn !== 'never') {
      const now = new Date();
      if (expiresIn === '1h') expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
      else if (expiresIn === '24h') expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      else if (expiresIn === '7d') expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      else if (expiresIn === '30d') expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }

    const fileDoc = await File.create({
      owner: req.user ? req.user._id : null,
      originalName: req.file.originalname,
      fileName: cloudResult.public_id,
      fileUrl: cloudResult.secure_url,
      publicId: cloudResult.public_id,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      shortCode,
      password: hashedPassword,
      isPasswordProtected: !!password,
      expiresAt,
      maxDownloads: maxDownloads ? parseInt(maxDownloads) : null,
      isPublic: isPublic !== 'false',
      description: description || '',
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    });

    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { storageUsed: req.file.size } });
    }

    const shareUrl = `${process.env.APP_URL || 'http://localhost:5000'}/share/${shortCode}`;
    const qrCode = await QRCode.toDataURL(shareUrl);

    res.status(201).json({
      success: true,
      file: {
        id: fileDoc._id,
        shortCode: fileDoc.shortCode,
        originalName: fileDoc.originalName,
        fileSize: fileDoc.fileSize,
        mimeType: fileDoc.mimeType,
        fileType: fileDoc.fileType,
        isPasswordProtected: fileDoc.isPasswordProtected,
        expiresAt: fileDoc.expiresAt,
        shareUrl,
        qrCode,
        createdAt: fileDoc.createdAt,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// @GET /api/files/my
router.get('/my', protect, async (req, res) => {
  try {
    const { page = 1, limit = 12, type, search } = req.query;
    const query = { owner: req.user._id };
    if (type && type !== 'all') query.fileType = type;
    if (search) query.originalName = { $regex: search, $options: 'i' };

    const files = await File.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password');

    const total = await File.countDocuments(query);
    const baseUrl = process.env.APP_URL || 'http://localhost:5000';
    const filesWithUrls = files.map(f => ({
      ...f.toObject(),
      shareUrl: `${baseUrl}/share/${f.shortCode}`
    }));

    res.json({ files: filesWithUrls, total, pages: Math.ceil(total / limit), current: page });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @GET /api/files/:shortCode
router.get('/:shortCode', optionalAuth, async (req, res) => {
  try {
    const file = await File.findOne({ shortCode: req.params.shortCode }).select('-password');
    if (!file) return res.status(404).json({ error: 'File not found' });
    if (file.expiresAt && new Date() > file.expiresAt)
      return res.status(410).json({ error: 'This file has expired' });

    await File.findByIdAndUpdate(file._id, { $inc: { viewCount: 1 } });
    const baseUrl = process.env.APP_URL || 'http://localhost:5000';

    res.json({
      id: file._id,
      originalName: file.originalName,
      fileSize: file.fileSize,
      mimeType: file.mimeType,
      fileType: file.fileType,
      isPasswordProtected: file.isPasswordProtected,
      expiresAt: file.expiresAt,
      downloadCount: file.downloadCount,
      viewCount: file.viewCount + 1,
      description: file.description,
      tags: file.tags,
      shareUrl: `${baseUrl}/share/${file.shortCode}`,
      createdAt: file.createdAt,
      fileUrl: !file.isPasswordProtected ? file.fileUrl : undefined,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @POST /api/files/:shortCode/access
router.post('/:shortCode/access', async (req, res) => {
  try {
    const file = await File.findOne({ shortCode: req.params.shortCode }).select('+password');
    if (!file) return res.status(404).json({ error: 'File not found' });
    if (!file.isPasswordProtected) return res.json({ fileUrl: file.fileUrl });

    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password required' });

    const match = await bcrypt.compare(password, file.password);
    if (!match) return res.status(401).json({ error: 'Incorrect password' });

    res.json({ fileUrl: file.fileUrl, originalName: file.originalName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @POST /api/files/:shortCode/download
router.post('/:shortCode/download', async (req, res) => {
  try {
    const file = await File.findOne({ shortCode: req.params.shortCode });
    if (!file) return res.status(404).json({ error: 'File not found' });
    if (file.maxDownloads && file.downloadCount >= file.maxDownloads)
      return res.status(403).json({ error: 'Download limit reached' });

    await File.findByIdAndUpdate(file._id, { $inc: { downloadCount: 1 } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @GET /api/files/:shortCode/qr
router.get('/:shortCode/qr', async (req, res) => {
  try {
    const file = await File.findOne({ shortCode: req.params.shortCode });
    if (!file) return res.status(404).json({ error: 'File not found' });

    const shareUrl = `${process.env.APP_URL || 'http://localhost:5000'}/share/${file.shortCode}`;
    const qrCode = await QRCode.toDataURL(shareUrl, { width: 300, margin: 2 });
    res.json({ qrCode, shareUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @DELETE /api/files/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });
    if (file.owner?.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Not authorized' });

    try {
      const resourceType = file.fileType === 'image' ? 'image' : file.fileType === 'video' ? 'video' : 'raw';
      await cloudinary.uploader.destroy(file.publicId, { resource_type: resourceType });
    } catch (cloudErr) {
      console.error('Cloudinary delete error:', cloudErr.message);
    }

    await File.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.user._id, { $inc: { storageUsed: -file.fileSize } });

    res.json({ success: true, message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;