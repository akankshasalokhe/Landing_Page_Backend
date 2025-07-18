const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  page: { type: String, required: true },
  imageUrl: { type: String, required: true },
  imageId: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
