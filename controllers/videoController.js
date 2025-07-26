const fs = require('fs');
const path = require('path');
const VideoUpload = require('../models/videoModel');
const imagekit = require('../imagekitConfig');
const { v4: uuidv4 } = require('uuid');

// Upload video
const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);

    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: `${uuidv4()}-${req.file.originalname}`,
      useUniqueFileName: true,
      folder: '/videos',
    });

    // Delete local file after upload
    fs.unlinkSync(filePath);

    const newVideo = new VideoUpload({
      video: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });

    await newVideo.save();
    res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
  } catch (error) {
    console.error('Upload Error:', error.message);
    res.status(500).json({ error: 'Failed to upload video' });
  }
};

// Get all videos
const getVideos = async (req, res) => {
  try {
    const videos = await VideoUpload.find().sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

// Delete video
const deleteVideo = async (req, res) => {
  try {
    const video = await VideoUpload.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await imagekit.deleteFile(video.fileId);
    await VideoUpload.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete video' });
  }
};

module.exports = {
  uploadVideo,
  getVideos,
  deleteVideo,
};
