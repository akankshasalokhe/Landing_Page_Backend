const mongoose = require('mongoose');

const TitleDescriptionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const CategorySchema = new mongoose.Schema({
  image: { type: [String], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const ServicePageSchema = new mongoose.Schema({
  servicetitle: { type: String, required: true },
  serviceImage: { type: String, required: true },
  titleDescArray: [TitleDescriptionSchema],
  categoryname: [CategorySchema],
});

module.exports = mongoose.model('ServicePage', ServicePageSchema);
