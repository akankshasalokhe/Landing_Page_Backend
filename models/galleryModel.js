const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  title: { type: String},
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GalleryCategory',
    required: true,
  },
  year: { type: String, required: function () { return this.categoryName === 'Events'; } },
  src: { type: String, required: true },
}, { timestamps: true });

galleryItemSchema.virtual('categoryName').get(function () {
  return this._categoryName;
}).set(function (val) {
  this._categoryName = val;
});

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
