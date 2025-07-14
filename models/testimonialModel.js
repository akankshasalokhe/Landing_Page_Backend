const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  description: { type: String, required: true },
  name: { type: String, default: 'Anonymous' },
  location: { type: String, default: 'Unknown' },
  image: { type: String },
  rating: { type: Number, default: 5, min: 1, max: 5 },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
