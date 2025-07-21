const express = require('express');
const router = express.Router();
const {
  submitContactForm,
  getAllContacts
} = require('../controllers/contactUsController');

// POST - Submit contact form
router.post('/submit', submitContactForm);

// GET - Retrieve all contact submissions
router.get('/get', getAllContacts);

module.exports = router;
