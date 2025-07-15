const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createTestimonial,
  getTestimonials,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('image'), createTestimonial);
router.get('/get', getTestimonials);
router.patch('/update/:id', upload.single('image'), updateTestimonial);
router.delete('/delete/:id', deleteTestimonial);

module.exports = router;
