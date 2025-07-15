const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
  uploadToImageKit,
  createGalleryItem,
  getGalleryItems,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');

const upload = multer({ storage: multer.memoryStorage() });

// Upload image
router.post('/upload', upload.single('image'), uploadToImageKit);

// CRUD Routes
router.post('/create', createGalleryItem);
router.get('/get', getGalleryItems);
router.put('/update/:id', createGalleryItem); // Note: upload logic is now done on frontend
router.delete('/delete/:id', deleteGalleryItem);

module.exports = router;
