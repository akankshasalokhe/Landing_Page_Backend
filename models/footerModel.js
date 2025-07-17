const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema({
  image: String, // base64 or image URL
  link: String,
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
