const mongoose = require('mongoose');

const partnerSectionSchema = new mongoose.Schema({
    image: { type: String, required: true },
    heading: { type: String, required: true },
    features: { type: [String], required: true }
}, { timestamps: true });

module.exports = mongoose.model('PartnerSection', partnerSectionSchema);
