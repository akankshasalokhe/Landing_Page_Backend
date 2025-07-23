const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require('../controllers/servicePageController');

const upload = multer({ dest: 'uploads/' });

router.get('/get', controller.getServices);
router.post('/create', upload.any(), controller.createService);
router.put('/update/:id', upload.any(), controller.updateService);
router.delete('/delete/:id', controller.deleteService);

module.exports = router;
