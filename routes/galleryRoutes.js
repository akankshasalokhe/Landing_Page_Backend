const express = require('express');
const { upload } = require('../middlewares/upload');
const {
  uploadToImageKit,
  createGalleryItem,
  getGalleryItems,
  updateGalleryItem,
  deleteGalleryItem
} = require('../controllers/galleryController.js');

const router = express.Router();

router.post('/upload', upload.single('image'), uploadToImageKit);
router.post('/create', createGalleryItem);
router.get('/get', getGalleryItems);
router.put('/update/:id', updateGalleryItem);
router.delete('/delete/:id', deleteGalleryItem);

module.exports = router;