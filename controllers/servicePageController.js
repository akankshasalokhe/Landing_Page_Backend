const ServicePage = require('../models/servicePageModel');
const uploadToImageKit = require('../utils/uploadToImagekit');

const createServicePage = async (req, res) => {
  try {
    const { servicetitle, titleDescArray, categoryname } = req.body;

    if (!servicetitle || !titleDescArray || !categoryname) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const parsedTitleDescArray = JSON.parse(titleDescArray);
    const parsedCategoryname = JSON.parse(categoryname);

    let serviceImageUrl = '';
    const serviceImageFile = req.files?.serviceImage?.[0];

    if (serviceImageFile) {
      serviceImageUrl = await uploadToImageKit(serviceImageFile, 'serviceImages');
    }

    const categoryImages = req.files?.categoryImages || [];

    const categoryWithImages = await Promise.all(
      parsedCategoryname.map(async (item) => {
        const matchedFiles = categoryImages.filter(file =>
          file.originalname.startsWith(item.tempImagePrefix)
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

const updateServicePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { servicetitle, titleDescArray, categoryname } = req.body;

    const parsedTitleDescArray = JSON.parse(titleDescArray);
    const parsedCategoryname = JSON.parse(categoryname);

    let serviceImageUrl;
    const serviceImageFile = req.files?.serviceImage?.[0];

    if (serviceImageFile) {
      serviceImageUrl = await uploadToImageKit(serviceImageFile, 'serviceImages');
    }

    const categoryImages = req.files?.categoryImages || [];

    const categoryWithImages = await Promise.all(
      parsedCategoryname.map(async (item) => {
        const matchedFiles = categoryImages.filter(file =>
          file.originalname.startsWith(item.tempImagePrefix)
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

    const updated = await ServicePage.findByIdAndUpdate(
      id,
      {
        servicetitle,
        ...(serviceImageUrl && { serviceImage: serviceImageUrl }),
        titleDescArray: parsedTitleDescArray,
        categoryname: categoryWithImages,
      },
      { new: true }
    );

    res.status(200).json({ message: 'ServicePage updated', data: updated });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getAllServicePages = async (req, res) => {
  try {
    const services = await ServicePage.find().lean();
    res.status(200).json({ data: services });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
  updateServicePage,
  getAllServicePages,
  deleteServicePage
};