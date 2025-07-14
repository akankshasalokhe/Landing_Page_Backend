const express = require('express');
const router = express.Router();

// Import multer config from middlewares/upload.js
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  uploadToImageKit,
  createGalleryItem,
  getGalleryItems,
  updateGalleryItem,
  deleteGalleryItem
} = require('../controllers/galleryController');

// Upload image to ImageKit and return URL
router.post('/upload', upload.single('image'), uploadToImageKit);

// Create a new gallery item with imageUrl, category, title, year, etc.
router.post('/create', createGalleryItem);

// Get all gallery items or filter by query
router.get('/get', getGalleryItems);

// Update a gallery item by ID
router.put('/update/:id', upload.single('image'), uploadToImageKit, updateGalleryItem);

// Delete a gallery item by ID
router.delete('/delete/:id', deleteGalleryItem);

module.exports = router;
