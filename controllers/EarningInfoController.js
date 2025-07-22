const BusinessInfo = require('../models/EarningFormModel');

// Create
exports.createBusinessInfo = async (req, res) => {
  try {
    const info = new BusinessInfo(req.body);
    await info.save();
    res.status(201).json(info);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read All
exports.getAllBusinessInfos = async (req, res) => {
  try {
    const infos = await BusinessInfo.find();
    res.status(200).json(infos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read One
exports.getBusinessInfoById = async (req, res) => {
  try {
    const info = await BusinessInfo.findById(req.params.id);
    if (!info) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateBusinessInfo = async (req, res) => {
  try {
    const info = await BusinessInfo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!info) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(info);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.deleteBusinessInfo = async (req, res) => {
  try {
    const info = await BusinessInfo.findByIdAndDelete(req.params.id);
    if (!info) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
