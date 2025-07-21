const ServiceProvider = require('../models/serviceProviderEnquiryModel');

// Get all service providers
exports.getServices = async (req, res) => {
  try {
    const services = await ServiceProvider.find().sort({ createdAt: -1 });
    res.status(200).json({ data: services });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

// Create service provider
exports.createService = async (req, res) => {
  try {
    const { firstName, middleName, lastName, email, phoneNumber, address, module, message } = req.body;

    const newService = new ServiceProvider({
      firstName,
      middleName,
      lastName,
      email,
      phoneNumber,
      address,
      module,
      message,
      fileUrl: req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null,
    });

    const savedService = await newService.save();
    res.status(201).json({ data: savedService });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create service' });
  }
};

// Delete service provider
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await ServiceProvider.findByIdAndDelete(id);
    res.status(200).json({ message: 'Service provider deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
};
