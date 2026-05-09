const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

const uploadToCloudinary = (buffer, originalname, mimetype) => {
  return new Promise((resolve, reject) => {
    let resource_type = 'raw';
    if (mimetype.startsWith('image/')) resource_type = 'image';
    if (mimetype.startsWith('video/')) resource_type = 'video';

    const stream = cloudinary.uploader.upload_stream(
      { folder: 'pastebox', resource_type, use_filename: true, unique_filename: true },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

module.exports = { cloudinary, upload, uploadToCloudinary };