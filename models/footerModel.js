const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema({
  type: { type: String },         // e.g., Facebook, Play Store
  image: { type: String },        // image URL
  link: { type: String },         // redirect URL
});

const footerSchema = new mongoose.Schema({
  companyName: { type: String },
  description: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  address: { type: String },
  socialLinks: [socialLinkSchema],
}, { timestamps: true });

module.exports = mongoose.model('Footer', footerSchema);
