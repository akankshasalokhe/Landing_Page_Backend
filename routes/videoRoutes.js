const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  uploadVideo,
  getVideos,
  deleteVideo
} = require('../controllers/videoController');

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // max 100MB
});

// Routes
router.post('/upload', upload.single('video'), uploadVideo);
router.get('/get', getVideos);
router.delete('/delete/:id', deleteVideo);

module.exports = router;
