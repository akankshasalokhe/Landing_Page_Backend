const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createContentSection,
  getAllContentSections,
  getContentSectionById,
  updateContentSection,
  deleteContentSection,
} = require('../controllers/contentSectionController');

// Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post('/create', upload.single('image'), createContentSection);
router.get('/get', getAllContentSections);
router.get('/getbyId/:id', getContentSectionById);
router.put('/update/:id', upload.single('image'), updateContentSection);
router.delete('/delete/:id', deleteContentSection);

module.exports = router;
