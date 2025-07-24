const mongoose = require('mongoose');

const nationWideItemSchema = new mongoose.Schema({
  category: { type: String, required: true }, // example: 'nationwide'
  heading: { type: String, required: true },
  subheading: { type: String, required: true },
  image: { type: String, required: true },
  features: [{ type: String, required: true }],
  arrayofimage: [{ type: String, required: true }]
}, { timestamps: true });

module.exports = mongoose.model('NationWideItem', nationWideItemSchema);
