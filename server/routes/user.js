const express = require('express');
const router = express.Router();
const User = require('../models/User');
const File = require('../models/File');
const { protect } = require('../middleware/auth');

// @GET /api/user/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const totalFiles = await File.countDocuments({ owner: req.user._id });
    const totalDownloads = await File.aggregate([
      { $match: { owner: req.user._id } },
      { $group: { _id: null, total: { $sum: '$downloadCount' } } }
    ]);
    const byType = await File.aggregate([
      { $match: { owner: req.user._id } },
      { $group: { _id: '$fileType', count: { $sum: 1 } } }
    ]);

    res.json({
      totalFiles,
      totalDownloads: totalDownloads[0]?.total || 0,
      storageUsed: req.user.storageUsed,
      storageLimit: req.user.storageLimit,
      byType: byType.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.count }), {}),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @PUT /api/user/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { username }, { new: true, runValidators: true });
    res.json({ id: user._id, username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @PUT /api/user/password
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword)))
      return res.status(401).json({ error: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
