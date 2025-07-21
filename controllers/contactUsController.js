// const ContactUs = require('../models/contactUsModel');


// exports.submitContactForm = async (req, res) => {
//   try {
//     const { FirstName, LastName, EmailAddress, PhoneNo, Services, Message } = req.body;

//     const contact = new ContactUs({
//       FirstName,
//       LastName,
//       EmailAddress,
//       PhoneNo,
//       Services,
//       Message
//     });

//     await contact.save();
//     res.status(201).json({ message: 'Contact form submitted successfully', contact });
//   } catch (error) {
//     console.error('Submit Error:', error);
//     res.status(500).json({ error: 'Failed to submit contact form' });
//   }
// };


// exports.getAllContacts = async (req, res) => {
//   try {
//     const contacts = await ContactUs.find().sort({ createdAt: -1 });
//     res.status(200).json(contacts);
//   } catch (error) {
//     console.error('Fetch Error:', error);
//     res.status(500).json({ error: 'Failed to fetch contact data' });
//   }
// };
