const ContactUs = require('../models/contactUsModel');

// Submit contact form
exports.submitContactForm = async (req, res) => {
  try {
    const { FirstName, LastName, EmailAddress, PhoneNo, Services, Message } = req.body;

    if (!FirstName || !LastName || !EmailAddress || !PhoneNo || !Services || !Message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newContact = new ContactUs({
      FirstName,
      LastName,
      EmailAddress,
      PhoneNo,
      Services,
      Message
    });

    await newContact.save();

    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all contact submissions
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactUs.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch contact submissions' });
  }
};

// Delete contact submission by ID
exports.deleteContact = async (req, res) => {
  try {
    const contact = await ContactUs.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await contact.remove();

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
