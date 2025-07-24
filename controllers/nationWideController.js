const NationWideItem = require('../models/nationWideModel');
const imagekit = require('../imagekitConfig');
const fs = require('fs');

// CREATE
exports.createNationWideItem = async (req, res) => {
  try {
    const { category, heading, subheading, features } = req.body;
    const parsedFeatures = JSON.parse(features);
    const arrayOfImages = [];

    const mainImage = req.files.image[0];
    const mainImageUpload = await imagekit.upload({
      file: fs.readFileSync(mainImage.path),
      fileName: mainImage.originalname,
    });

    for (let file of req.files.arrayofimage) {
      const result = await imagekit.upload({
        file: fs.readFileSync(file.path),
        fileName: file.originalname,
      });
      arrayOfImages.push(result.url);
    }

    const newItem = new NationWideItem({
      category,
      heading,
      subheading,
      image: mainImageUpload.url,
      features: parsedFeatures,
      arrayofimage: arrayOfImages,
    });

    await newItem.save();
    res.status(201).json({ message: 'Created', data: newItem });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ error: 'Server error' });
  }
};

// READ ALL
exports.getNationWideItems = async (req, res) => {
  try {
    const items = await NationWideItem.find();
    res.status(200).json({ data: items });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// READ ONE
exports.getNationWideItemById = async (req, res) => {
  try {
    const item = await NationWideItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ data: item });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE
exports.updateNationWideItem = async (req, res) => {
  try {
    const { category, heading, subheading, features } = req.body;
    const item = await NationWideItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });

    let mainImageUrl = item.image;
    let updatedFeatureImages = item.arrayofimage;

    if (req.files?.image?.[0]) {
      const uploadMain = await imagekit.upload({
        file: fs.readFileSync(req.files.image[0].path),
        fileName: req.files.image[0].originalname,
      });
      mainImageUrl = uploadMain.url;
    }

    if (req.files?.arrayofimage?.length > 0) {
      updatedFeatureImages = [];
      for (let file of req.files.arrayofimage) {
        const uploaded = await imagekit.upload({
          file: fs.readFileSync(file.path),
          fileName: file.originalname,
        });
        updatedFeatureImages.push(uploaded.url);
      }
    }

    item.category = category || item.category;
    item.heading = heading || item.heading;
    item.subheading = subheading || item.subheading;
    item.features = features ? JSON.parse(features) : item.features;
    item.image = mainImageUrl;
    item.arrayofimage = updatedFeatureImages;

    await item.save();
    res.status(200).json({ message: 'Updated', data: item });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE
exports.deleteNationWideItem = async (req, res) => {
  try {
    const item = await NationWideItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
