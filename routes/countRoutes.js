const express = require('express');
const router = express.Router();
const countController = require('../controllers/countController');

// Routes
router.get('/get', countController.getAllCounts);
router.get('/getbyId/:id', countController.getCountById);
router.post('/create', countController.createCount);
router.put('/update/:id', countController.updateCount);
router.delete('/delete/:id', countController.deleteCount);

module.exports = router;
