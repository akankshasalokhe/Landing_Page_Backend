const express = require('express');
const router = express.Router();
const multer = require('multer');
const { addService, updateService, getServices, deleteService } = require('../controllers/serviceController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/get', getServices);
router.post('/add', upload.fields([
  { name: 'serviceImage', maxCount: 1 },
  { name: 'categoryImages', maxCount: 10 }
]), addService);
router.put('/update/:id', upload.fields([
  { name: 'serviceImage', maxCount: 1 },
  { name: 'categoryImages', maxCount: 10 }
]), updateService);
router.delete('/delete/:id', deleteService);

module.exports = router;
