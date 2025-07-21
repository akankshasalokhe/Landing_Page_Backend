const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  address: String,
  module: String,
  message: String,
  fileUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);
