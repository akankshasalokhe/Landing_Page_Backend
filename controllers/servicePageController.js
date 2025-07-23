const ServicePage = require('../models/servicePageModel');
const uploadToImageKit = require('../utils/uploadToImagekit');

const parseJSONField = (field, fieldName, res) => {
  try {
    return JSON.parse(field);
  } catch {
    res.status(400).json({ message: `Invalid JSON format for ${fieldName}` });
    throw new Error(`Invalid JSON format for ${fieldName}`);
  }
};

const getFileArray = (files, key) => {
  return (files && files[key]) || [];
};

const getSingleFile = (files, key) => {
  return getFileArray(files, key)[0] || null;
};

const createServicePage = async (req, res) => {
  try {
    const { servicetitle, titleDescArray, categoryname } = req.body;
    if (!servicetitle || !titleDescArray || !categoryname) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const parsedTitleDescArray = parseJSONField(titleDescArray, 'titleDescArray', res);
    const parsedCategoryname = parseJSONField(categoryname, 'categoryname', res);

    const files = req.files || {};
    let serviceImageUrl = '';
    const serviceImageFile = getSingleFile(files, 'serviceImage');

    if (serviceImageFile) {
      try {
        serviceImageUrl = await uploadToImageKit(serviceImageFile, 'serviceImages');
      } catch (err) {
        console.error('Service image upload error:', err);
        return res.status(500).json({ message: 'Service image upload failed' });
      }
    }

    const categoryImages = getFileArray(files, 'categoryImages');

    const categoryWithImages = await Promise.all(
      parsedCategoryname.map(async (item) => {
        const matchedFiles = categoryImages.filter(file =>
          file.originalname.startsWith(item.tempImagePrefix)
        );

        let imageUrls = [];

        if (matchedFiles.length) {
          try {
            imageUrls = await Promise.all(
              matchedFiles.map(file => uploadToImageKit(file, 'categoryImages'))
            );
          } catch (err) {
            console.error('Category image upload error:', err);
            return res.status(500).json({ message: 'Category image upload failed' });
          }
        }

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

    const parsedTitleDescArray = parseJSONField(titleDescArray, 'titleDescArray', res);
    const parsedCategoryname = parseJSONField(categoryname, 'categoryname', res);

    const files = req.files || {};
    let serviceImageUrl;
    const serviceImageFile = getSingleFile(files, 'serviceImage');

    if (serviceImageFile) {
      try {
        serviceImageUrl = await uploadToImageKit(serviceImageFile, 'serviceImages');
      } catch (err) {
        console.error('Service image upload error:', err);
        return res.status(500).json({ message: 'Service image upload failed' });
      }
    }

    const categoryImages = getFileArray(files, 'categoryImages');

    const categoryWithImages = await Promise.all(
      parsedCategoryname.map(async (item) => {
        const matchedFiles = categoryImages.filter(file =>
          file.originalname.startsWith(item.tempImagePrefix)
        );

        let imageUrls = [];

        if (matchedFiles.length) {
          try {
            imageUrls = await Promise.all(
              matchedFiles.map(file => uploadToImageKit(file, 'categoryImages'))
            );
          } catch (err) {
            console.error('Category image upload error:', err);
            return res.status(500).json({ message: 'Category image upload failed' });
          }
        }

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

    if (serviceImageUrl) {
      updatePayload.serviceImage = serviceImageUrl;
    }

    const updated = await ServicePage.findByIdAndUpdate(id, updatePayload, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'ServicePage not found' });
    }

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
  deleteServicePage,
};
