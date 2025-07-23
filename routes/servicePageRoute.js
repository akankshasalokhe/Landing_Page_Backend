const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const controller = require('../controllers/servicePageController');

// Use upload.any() for dynamic categoryImage_x
router.post('/create', upload.any(), controller.createServicePage);
router.get('/get', controller.getAllServicePages);
router.get('/getbyId/:id', controller.getServicePageById);
router.put('/update/:id', upload.any(), controller.updateServicePage);
router.delete('/delete/:id', controller.deleteServicePage);

module.exports = router;
