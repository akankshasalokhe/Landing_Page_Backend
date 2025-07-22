const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getServices, createService, deleteService } = require('../controllers/serviceProviderController');

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.get('/get', getServices);
router.post('/create', upload.single('file'), createService);
router.delete('/delete/:id', deleteService);

module.exports = router;
