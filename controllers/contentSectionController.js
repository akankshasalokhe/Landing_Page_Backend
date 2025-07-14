const { v4: uuidv4 } = require('uuid');
const imagekit = require('../imagekitConfig');
const ContentSection = require('../models/contentSectionModel');


// Create content section
const createContentSection = async (req, res) => {
  try {
    const { Heading, Subheading, content } = req.body;

    if (!Heading || !Subheading || !content || !req.file) {
      return res.status(400).json({ error: 'All fields including image are required' });
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid content JSON' });
    }

    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: `${uuidv4()}-${req.file.originalname}`,
      useUniqueFileName: true,
      folder: '/contentSection',
    });

    const newSection = new ContentSection({
      Heading,
      Subheading,
      image: uploadedImage.url,
      content: parsedContent,
    });

    await newSection.save();
    res.status(201).json({ message: 'Created', section: newSection });
  } catch (err) {
    console.error('Create Error:', err);
    res.status(500).json({ error: 'Failed to create' });
  }
};


// Get all
const getAllContentSections = async (req, res) => {
  try {
    const sections = await ContentSection.find().sort({ createdAt: -1 });
    res.status(200).json(sections);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
};

// Get single
const getContentSectionById = async (req, res) => {
  try {
    const section = await ContentSection.findById(req.params.id);
    if (!section) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(section);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
};

// Update
const updateContentSection = async (req, res) => {
  try {
    const { Heading, Subheading, content } = req.body;
    let updatedData = { Heading, Subheading, content: JSON.parse(content) };

    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${uuidv4()}-${req.file.originalname}`,
        useUniqueFileName: true,
        folder: '/contentSection',
      });
      updatedData.image = uploadedImage.url;
    }

    const updatedSection = await ContentSection.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedSection) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ message: 'Updated', section: updatedSection });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
};

// Delete
const deleteContentSection = async (req, res) => {
  try {
    const deleted = await ContentSection.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

module.exports = {
  createContentSection,
  getAllContentSections,
  getContentSectionById,
  updateContentSection,
  deleteContentSection,
};
