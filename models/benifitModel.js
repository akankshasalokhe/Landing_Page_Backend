const mongoose = require('mongoose');

const benefitSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Benefit', benefitSchema);
