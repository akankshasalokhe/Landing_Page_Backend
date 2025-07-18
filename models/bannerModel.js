const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  page: { type: String, required: true }, // e.g. "Home", "About Us"
  imageUrl: { type: String, required: true },
  imageId: { type: String }, // For deleting from ImageKit
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Banner', bannerSchema);
