const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: String,
  description: String,
  image: [String], // Multiple image URLs
});

const serviceSchema = new mongoose.Schema({
  servicetitle: { type: String, required: true },
  serviceImage: { type: String },
  titleDescArray: [
    {
      title: String,
      description: String,
    },
  ],
  categoryname: [categorySchema],
});



module.exports = mongoose.model('ServicePage', serviceSchema);
