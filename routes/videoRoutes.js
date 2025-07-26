const express = require('express');
const router = express.Router();
const {
  uploadVideo,
  getVideos,
  deleteVideo
} = require('../controllers/videoController');

const upload = require('../middlewares/uploadDisk');

// Routes
router.post('/upload', upload.single('video'), uploadVideo);
router.get('/get', getVideos);
router.delete('/delete/:id', deleteVideo);

module.exports = router;
