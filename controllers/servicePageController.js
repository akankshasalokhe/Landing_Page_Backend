const fs = require('fs').promises;
const ServicePage = require('../models/servicePageModel');
const imagekit = require('../imagekitConfig');

// Upload helper
const uploadToImageKit = async (file, folder) => {
  const uploaded = await imagekit.upload({
    file: await fs.readFile(file.path),
    fileName: file.originalname,
    folder,
  });
  await fs.unlink(file.path); // delete local file after upload
  return uploaded.url;
};

// Create Service Page
const createServicePage = async (req, res) => {
  try {
    const { servicetitle, titleDescArray, categoryname } = req.body;

    if (!servicetitle || !titleDescArray || !categoryname) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let parsedTitleDescArray = [];
    let parsedCategoryname = [];

    try {
      parsedTitleDescArray = JSON.parse(titleDescArray);
      parsedCategoryname = JSON.parse(categoryname);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid JSON format in titleDescArray or categoryname' });
    }

    const serviceImageFile = req.files?.serviceImage?.[0];
    let serviceImageUrl = '';

    if (serviceImageFile) {
      serviceImageUrl = await uploadToImageKit(serviceImageFile, 'serviceImages');
    }

    const categoryImages = req.files?.categoryImages || [];

    const categoryWithImages = await Promise.all(
      parsedCategoryname.map(async (item) => {
        const matchedFiles = categoryImages.filter(file =>
          file.originalname.startsWith(item.tempImageName)
        );

        const imageUrls = await Promise.all(
          matchedFiles.map(file => uploadToImageKit(file, 'categoryImages'))
        );

        return {
          title: item.title,
          description: item.description,
          image: imageUrls,
        };
      })
    );

    const newServicePage = new ServicePage({
      servicetitle,
      serviceImage: serviceImageUrl,
      titleDescArray: parsedTitleDescArray,
      categoryname: categoryWithImages,
    });

    await newServicePage.save();
    res.status(201).json({ message: 'ServicePage created', data: newServicePage });
  } catch (error) {
    console.error('Create Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get All Service Pages
const getAllServicePages = async (req, res) => {
  try {
    const services = await ServicePage.find().lean();
    res.status(200).json({ data: services });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Service Page By ID
const getServicePageById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await ServicePage.findById(id).lean();
    if (!service) return res.status(404).json({ message: 'ServicePage not found' });
    res.status(200).json({ data: service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Service Page
const updateServicePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { servicetitle, titleDescArray, categoryname } = req.body;

    const existingService = await ServicePage.findById(id);
    if (!existingService) return res.status(404).json({ message: 'ServicePage not found' });

    let parsedTitleDescArray = [];
    let parsedCategoryname = [];

    try {
      parsedTitleDescArray = JSON.parse(titleDescArray || '[]');
      parsedCategoryname = JSON.parse(categoryname || '[]');
    } catch (err) {
      return res.status(400).json({ message: 'Invalid JSON format in titleDescArray or categoryname' });
    }

    const existingCategories = existingService.categoryname || [];
    const categoryImages = req.files?.categoryImages || [];

    const updatedCategories = await Promise.all(
      parsedCategoryname.map(async (item) => {
        let imageUrls = Array.isArray(item.image) ? item.image : [];

        if (item.tempImageName) {
          const matchedFiles = categoryImages.filter(file =>
            file.originalname.startsWith(item.tempImageName)
          );

          if (matchedFiles.length > 0) {
            const uploadedUrls = await Promise.all(
              matchedFiles.map(file => uploadToImageKit(file, 'categoryImages'))
            );
            imageUrls = uploadedUrls;
          }
        }

        if (!imageUrls.length) {
          const oldMatch = existingCategories.find(cat => cat.title === item.title);
          imageUrls = oldMatch?.image || [];
        }

        return {
          title: item.title,
          description: item.description,
          image: imageUrls,
        };
      })
    );

    let serviceImageUrl = existingService.serviceImage;
    const serviceImageFile = req.files?.serviceImage?.[0];

    if (serviceImageFile) {
      serviceImageUrl = await uploadToImageKit(serviceImageFile, 'serviceImages');
    }

    const updatedService = await ServicePage.findByIdAndUpdate(
      id,
      {
        servicetitle,
        serviceImage: serviceImageUrl,
        titleDescArray: parsedTitleDescArray,
        categoryname: updatedCategories,
      },
      { new: true }
    );

    res.status(200).json({ message: 'ServicePage updated', data: updatedService });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete Service Page
const deleteServicePage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ServicePage.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'ServicePage not found' });
    res.status(200).json({ message: 'ServicePage deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createServicePage,
  getAllServicePages,
  getServicePageById,
  updateServicePage,
  deleteServicePage,
};
