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
// exports.getAllContacts = async (req, res) => {
//   try {
//     const contacts = await ContactUs.find().sort({ createdAt: -1 });
//     res.json(contacts);
//   } catch (error) {
//     console.error('Fetch error:', error);
//     res.status(500).json({ message: 'Failed to fetch contact submissions' });
//   }
// };

exports.getAllContacts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      fromDate,
      toDate
    } = req.query;

    const query = {};

    // Search
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { FirstName: regex },
        { LastName: regex },
        { EmailAddress: regex },
        { PhoneNo: regex },
        { Services: regex },
        { Message: regex },
      ];
    }

    // Date filter
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    const total = await ContactUs.countDocuments(query);

    const contacts = await ContactUs.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      data: contacts,
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
};


// Delete contact submission by ID

exports.deleteContact = async (req, res) => {
  try {
    const contact = await ContactUs.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    await contact.deleteOne(); // Use deleteOne() or findByIdAndDelete
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

