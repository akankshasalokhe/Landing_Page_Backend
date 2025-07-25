const mongoose = require('mongoose');

const VideoUploadSchema = new mongoose.Schema({
  video: { type: String, required: true },
  fileId: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('VideoUpload', VideoUploadSchema);
