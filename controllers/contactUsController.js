const ContactUs = require('../models/contactUsModel');

// Create Contact Entry
exports.createContact = async (req, res) => {
  try {
    const contact = new ContactUs(req.body);
    const saved = await contact.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Contact Entries
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactUs.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Contact by ID
exports.getContactById = async (req, res) => {
  try {
    const contact = await ContactUs.findById(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Contact
exports.updateContact = async (req, res) => {
  try {
    const updated = await ContactUs.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Contact not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Contact
exports.deleteContact = async (req, res) => {
  try {
    const deleted = await ContactUs.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Contact not found' });
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
