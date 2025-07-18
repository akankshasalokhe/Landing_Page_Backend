const Footer = require('../models/footerModel');

// GET footer (single document)
exports.getFooter = async (req, res) => {
  try {
    const footer = await Footer.findOne();
    res.json(footer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE footer (optional use)
exports.createFooter = async (req, res) => {
  try {
    const footer = new Footer(req.body);
    await footer.save();
    res.status(201).json(footer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE footer
exports.updateFooter = async (req, res) => {
  try {
    const updated = await Footer.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true, // create if not exists
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE all footer records (optional)
exports.deleteFooter = async (req, res) => {
  try {
    await Footer.deleteMany();
    res.json({ message: 'Footer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
