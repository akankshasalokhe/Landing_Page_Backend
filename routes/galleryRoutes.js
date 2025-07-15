const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); // ✅ uses temp/ disk storage

const {
  uploadToImageKit,
  createGalleryItem,
  getGalleryItems,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');

// Upload image to ImageKit and return URL
router.post('/upload', upload.single('image'), uploadToImageKit);

// Create a new gallery item
router.post('/create', createGalleryItem);

// Get all gallery items
router.get('/get', getGalleryItems);

// Update gallery item
router.put('/update/:id', upload.single('image'), uploadToImageKit, updateGalleryItem);

// Delete gallery item
router.delete('/delete/:id', deleteGalleryItem);

module.exports = router;
