const express = require('express');
const router = express.Router();
const contactUsController = require('../controllers/contactUsController');

// Create
router.post('/submit', contactUsController.createContact);

// Read All
router.get('/get', contactUsController.getAllContacts);

// Read One
router.get('/getbyId/:id', contactUsController.getContactById);

// Update
router.put('/update/:id', contactUsController.updateContact);

// Delete
router.delete('/delete/:id', contactUsController.deleteContact);

module.exports = router;
