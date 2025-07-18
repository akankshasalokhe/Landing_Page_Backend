// controllers/servicePageController.js
const ServicePage = require('../models/servicePageModel');
const uploadToImageKit = require('../imagekitConfig');

// Create Service Page
const createServicePage = async (req, res) => {
  try {
    const { servicetitle, titleDescArray, categoryname } = req.body;

    if (!servicetitle || !titleDescArray || !categoryname) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const parsedTitleDescArray = JSON.parse(titleDescArray);
    const parsedCategoryname = JSON.parse(categoryname);

    const serviceImageFile = req.files?.serviceImage?.[0];
    const serviceImageUrl = serviceImageFile
      ? await uploadToImageKit(serviceImageFile, 'serviceImages')
      : '';

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

// Update Service Page
const updateServicePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { servicetitle, titleDescArray, categoryname } = req.body;

    const existingService = await ServicePage.findById(id);
    if (!existingService) return res.status(404).json({ message: 'ServicePage not found' });

    const parsedTitleDescArray = JSON.parse(titleDescArray || '[]');
    const parsedCategoryname = JSON.parse(categoryname || '[]');

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

    const serviceImageFile = req.files?.serviceImage?.[0];
    const serviceImageUrl = serviceImageFile
      ? await uploadToImageKit(serviceImageFile, 'serviceImages')
      : existingService.serviceImage;

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

// Export
module.exports = {
  createServicePage,
  updateServicePage,
  getAllServicePages: async (req, res) => {
    try {
      const services = await ServicePage.find().lean();
      res.status(200).json({ data: services });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getServicePageById: async (req, res) => {
    try {
      const { id } = req.params;
      const service = await ServicePage.findById(id).lean();
      if (!service) return res.status(404).json({ message: 'ServicePage not found' });
      res.status(200).json({ data: service });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteServicePage: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await ServicePage.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: 'ServicePage not found' });
      res.status(200).json({ message: 'ServicePage deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
