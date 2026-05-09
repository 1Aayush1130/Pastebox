const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // null = anonymous upload
  },
  originalName: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String, // Cloudinary public_id for deletion
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ['image', 'video', 'audio', 'document', 'archive', 'other'],
    default: 'other',
  },
  shortCode: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    default: null, // optional password protection
    select: false,
  },
  isPasswordProtected: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    default: null, // null = never expires
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  maxDownloads: {
    type: Number,
    default: null, // null = unlimited
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    default: '',
    maxlength: 500,
  },
  tags: [String],
}, { timestamps: true });

// Auto-delete expired files (TTL index)
fileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { expiresAt: { $ne: null } } });

// Determine file type from MIME
fileSchema.pre('save', function (next) {
  const mime = this.mimeType;
  if (mime.startsWith('image/')) this.fileType = 'image';
  else if (mime.startsWith('video/')) this.fileType = 'video';
  else if (mime.startsWith('audio/')) this.fileType = 'audio';
  else if (['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'text/plain', 'text/csv'].includes(mime)) this.fileType = 'document';
  else if (['application/zip', 'application/x-rar-compressed', 'application/x-tar', 'application/gzip'].includes(mime)) this.fileType = 'archive';
  else this.fileType = 'other';
  next();
});

module.exports = mongoose.model('File', fileSchema);
