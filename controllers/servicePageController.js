const ServicePage = require('../models/servicePageModel');
const imagekit = require('../imagekitConfig');
const fs = require('fs');

// 🔁 Upload file to ImageKit and remove local file
const uploadToImageKit = async (file, folder = 'servicepage') => {
  const result = await imagekit.upload({
    file: fs.readFileSync(file.path),
    fileName: file.originalname,
    folder,
  });
  fs.unlinkSync(file.path); // remove temp file
  return result.url;
};

// ✅ GET All Services
exports.getServices = async (req, res) => {
  try {
    const services = await ServicePage.find().sort({ createdAt: -1 });
    res.json({ data: services });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch services', error: err.message });
  }
};

// ✅ CREATE Service
exports.createService = async (req, res) => {
  try {
    const { servicetitle, titleDescArray, categoryname } = req.body;

    const parsedTitleDesc = JSON.parse(titleDescArray || '[]');
    const parsedCategories = JSON.parse(categoryname || '[]');

    const filesMap = {};
    for (const file of req.files || []) {
      const url = await uploadToImageKit(file);
      filesMap[file.originalname] = url;
    }

    const serviceImageFile = req.files.find(f => f.fieldname === 'serviceImage');
    const serviceImageURL = serviceImageFile ? filesMap[serviceImageFile.originalname] : '';

    const finalCategories = parsedCategories.map((cat, idx) => {
      const prefix = `cat-${idx}-`;
      const imageUrls = Object.entries(filesMap)
        .filter(([filename]) => filename.startsWith(prefix))
        .map(([_, url]) => url);

      return {
        title: cat.title,
        description: cat.description,
        image: imageUrls,
      };
    });

    const newService = new ServicePage({
      servicetitle,
      serviceImage: serviceImageURL,
      titleDescArray: parsedTitleDesc,
      categoryname: finalCategories,
    });

    await newService.save();
    res.status(201).json({ message: 'Service created successfully', data: newService });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create service', error: err.message });
  }
};

// ✅ UPDATE Service
exports.updateService = async (req, res) => {
  try {
    const { servicetitle, titleDescArray, categoryname } = req.body;
    const { id } = req.params;

    const parsedTitleDesc = JSON.parse(titleDescArray || '[]');
    const parsedCategories = JSON.parse(categoryname || '[]');

    const filesMap = {};
    for (const file of req.files || []) {
      const url = await uploadToImageKit(file);
      filesMap[file.originalname] = url;
    }

    const serviceImageFile = req.files.find(f => f.fieldname === 'serviceImage');
    const serviceImageURL = serviceImageFile ? filesMap[serviceImageFile.originalname] : undefined;

    const finalCategories = parsedCategories.map((cat, idx) => {
      const prefix = `cat-${idx}-`;
      const imageUrls = Object.entries(filesMap)
        .filter(([filename]) => filename.startsWith(prefix))
        .map(([_, url]) => url);

      return {
        title: cat.title,
        description: cat.description,
        image: imageUrls,
      };
    });

    const updateData = {
      servicetitle,
      titleDescArray: parsedTitleDesc,
      categoryname: finalCategories,
    };

    if (serviceImageURL) updateData.serviceImage = serviceImageURL;

    const updated = await ServicePage.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ message: 'Service updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update service', error: err.message });
  }
};

// ✅ DELETE Service
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await ServicePage.findByIdAndDelete(id);
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete service', error: err.message });
  }
};
