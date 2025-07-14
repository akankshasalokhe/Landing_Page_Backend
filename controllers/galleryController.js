const GalleryItem = require( '../models/galleryModel.js');
const imagekit =require('../imagekitConfig.js');
const fs = require('fs');

exports.uploadToImageKit = async (req, res) => {
  try {
    const file = req.file;
    const response = await imagekit.upload({
      file: fs.readFileSync(file.path),
      fileName: file.originalname,
    });
    fs.unlinkSync(file.path);
    res.json({ url: response.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Image upload failed' });
  }
};

exports.createGalleryItem = async (req, res) => {
  try {
    const newItem = new GalleryItem(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getGalleryItems = async (req, res) => {
  try {
    const items = await GalleryItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateGalleryItem = async (req, res) => {
  try {
    const updatedItem = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteGalleryItem = async (req, res) => {
  try {
    await GalleryItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};