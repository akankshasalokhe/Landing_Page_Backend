const ServicePage = require('../models/servicePageModel');
const uploadToImageKit = require('../imagekitConfig'); // adjust path as needed

const createServicePage = async (req, res) => {
  try {
    const { servicetitle, titleDescArray, categoryname } = req.body;

    const parsedTitleDescArray = JSON.parse(titleDescArray);
    const parsedCategoryname = JSON.parse(categoryname);
    const files = req.files || {};

    let serviceImageUrl = '';
    const serviceImageFile = files['serviceImage']?.[0];

    if (serviceImageFile) {
      serviceImageUrl = await uploadToImageKit(serviceImageFile, 'serviceImages');
    }

    const categoryWithImages = await Promise.all(
      parsedCategoryname.map(async (item, index) => {
        const categoryFiles = files[`categoryImages${index}`] || [];
        const imageUrls = await Promise.all(
          categoryFiles.map(file => uploadToImageKit(file, 'categoryImages'))
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
    const files = req.files || {};
    const serviceImageFile = files['serviceImage']?.[0];

    let serviceImageUrl;

    if (serviceImageFile) {
      serviceImageUrl = await uploadToImageKit(serviceImageFile, 'serviceImages');
    }

    const categoryWithImages = await Promise.all(
      parsedCategoryname.map(async (item, index) => {
        const categoryFiles = files[`categoryImages${index}`] || [];
        const imageUrls = await Promise.all(
          categoryFiles.map(file => uploadToImageKit(file, 'categoryImages'))
        );

        return {
          title: item.title,
          description: item.description,
          image: imageUrls,
        };
      })
    );

    const updatePayload = {
      servicetitle,
      titleDescArray: parsedTitleDescArray,
      categoryname: categoryWithImages,
    };

    if (serviceImageUrl) updatePayload.serviceImage = serviceImageUrl;

    const updated = await ServicePage.findByIdAndUpdate(id, updatePayload, { new: true });

    if (!updated) return res.status(404).json({ message: 'ServicePage not found' });

    res.status(200).json({ message: 'ServicePage updated', data: updated });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createServicePage, updateServicePage, getAllServicePages, deleteServicePage };
