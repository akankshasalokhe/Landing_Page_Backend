const express = require('express');
const router = express.Router();
const {
  submitContactForm,
  getAllContacts,
  deleteContact
} = require('../controllers/contactUsController');

// POST /api/contact - Submit form
router.post('/create', submitContactForm);

// GET /api/contact - Get all submissions (Admin)
router.get('/get', getAllContacts);

// DELETE /api/contact/:id - Delete by ID (Admin)
router.delete('/delete/:id', deleteContact);

module.exports = router;
