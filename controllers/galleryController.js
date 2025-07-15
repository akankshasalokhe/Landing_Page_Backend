const GalleryItem = require('../models/galleryModel.js');
const imagekit = require('../imagekitConfig.js');

// Upload image to ImageKit
exports.uploadToImageKit = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const response = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
    });

    res.json({ url: response.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Image upload failed' });
  }
};

// Create gallery item
exports.createGalleryItem = async (req, res) => {
  try {
    const newItem = new GalleryItem(req.body);
    const savedItem = await newItem.save();
    res.status(201).json({ success: true, data: savedItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all gallery items
exports.getGalleryItems = async (req, res) => {
  try {
    const items = await GalleryItem.find().populate('category', 'name'); // only get category name
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update gallery item
exports.updateGalleryItem = async (req, res) => {
  try {
    const updatedItem = await GalleryItem.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        category: req.body.category,
        year: req.body.year || '',
        src: req.body.src,
      },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// Delete gallery item
exports.deleteGalleryItem = async (req, res) => {
  try {
    await GalleryItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
