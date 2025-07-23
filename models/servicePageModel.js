const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  title: String,
  description: String,
  image: [String],
});

const TitleDescSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const ServicePageSchema = new mongoose.Schema({
  servicetitle: { type: String, required: true },
  serviceImage: String,
  titleDescArray: [TitleDescSchema],
  categoryname: [CategorySchema],
}, { timestamps: true });

module.exports = mongoose.model('ServicePage', ServicePageSchema);
