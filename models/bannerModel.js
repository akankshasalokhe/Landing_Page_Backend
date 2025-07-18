// models/bannerModel.js
const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  page: { type: String, required: true },           // Page name
  imageUrl: { type: String, required: true },       // Image URL from ImageKit
  imageId: { type: String, required: true },        // ImageKit file ID
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
