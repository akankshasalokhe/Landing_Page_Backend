// models/GalleryItem.js
const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ['Awards', 'Certifications', 'Ceremony', 'Events'],
    required: true,
  },
  year: { type: String, required: function () { return this.category === 'Events'; } },
  src: { type: String, required: true }, // image URL or local path
}, { timestamps: true });

module.exports=mongoose.model('GalleryItem', galleryItemSchema);
