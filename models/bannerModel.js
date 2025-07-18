const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  page: { type: String, required: true },
  imageUrl: { type: String, required: true },
  imageKitFileId: { type: String, required: true },
  fileType: { type: String, default: 'image' } // 'image' or 'video'
});

module.exports = mongoose.model('Banner', bannerSchema);
