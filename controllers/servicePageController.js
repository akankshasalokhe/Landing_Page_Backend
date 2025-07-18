const Service = require('../models/Service');
const imagekit = require('../utils/imagekit');
const { v4: uuidv4 } = require('uuid');

const uploadToImagekit = async (file) => {
  const ext = file.originalname.split('.').pop();
  return await imagekit.upload({
    file: file.buffer,
    fileName: `${uuidv4()}.${ext}`
  });
};

exports.addService = async (req, res) => {
  try {
    const { servicetitle, titleDescArray, categoryname } = req.body;
    const parsedTitleDesc = JSON.parse(titleDescArray);
    const parsedCategories = JSON.parse(categoryname);
    const files = req.files || {};

    let serviceImageUrl = '';
    if (files.serviceImage?.[0]) {
      const imgRes = await uploadToImagekit(files.serviceImage[0]);
      serviceImageUrl = imgRes.url;
    }

    const categories = await Promise.all(parsedCategories.map(async (cat, index) => {
      let imageUrl = '';
      const file = files.categoryImages?.find(f => f.originalname === cat.tempImageName);
      if (file) {
        const imgRes = await uploadToImagekit(file);
        imageUrl = imgRes.url;
      }
      return {
        title: cat.title,
        description: cat.description,
        image: imageUrl ? [imageUrl] : cat.image || [],
      };
    }));

    const newService = new Service({
      servicetitle,
      serviceImage: serviceImageUrl,
      titleDescArray: parsedTitleDesc,
      categoryname: categories
    });

    await newService.save();
    res.status(201).json({ success: true, message: 'Service added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { servicetitle, titleDescArray, categoryname } = req.body;
    const { id } = req.params;
    const parsedTitleDesc = JSON.parse(titleDescArray);
    const parsedCategories = JSON.parse(categoryname);
    const files = req.files || {};

    let serviceImageUrl;
    if (files.serviceImage?.[0]) {
      const imgRes = await uploadToImagekit(files.serviceImage[0]);
      serviceImageUrl = imgRes.url;
    }

    const categories = await Promise.all(parsedCategories.map(async (cat, index) => {
      let imageUrl = '';
      const file = files.categoryImages?.find(f => f.originalname === cat.tempImageName);
      if (file) {
        const imgRes = await uploadToImagekit(file);
        imageUrl = imgRes.url;
      }
      return {
        title: cat.title,
        description: cat.description,
        image: imageUrl ? [imageUrl] : cat.image || [],
      };
    }));

    const updated = {
      servicetitle,
      titleDescArray: parsedTitleDesc,
      categoryname: categories
    };
    if (serviceImageUrl) updated.serviceImage = serviceImageUrl;

    await Service.findByIdAndUpdate(id, updated);
    res.json({ success: true, message: 'Service updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await Service.findByIdAndDelete(id);
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
