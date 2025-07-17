const Footer = require('../models/footerModel');

// Get footer
exports.getFooter = async (req, res) => {
  try {
    const footer = await Footer.findOne();
    res.json(footer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create footer (not used directly in frontend)
exports.createFooter = async (req, res) => {
  try {
    const footer = new Footer(req.body);
    await footer.save();
    res.status(201).json(footer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update footer (used in frontend with PUT)
exports.updateFooter = async (req, res) => {
  try {
    const updated = await Footer.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true, // create if doesn't exist
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete footer (optional)
exports.deleteFooter = async (req, res) => {
  try {
    await Footer.deleteMany();
    res.json({ message: 'Footer deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
