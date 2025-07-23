const ServicePage = require("../models/servicePageModel");
const imagekit = require("../imagekitConfig");



const uploadToImageKit = async (fileBuffer, fileName) => {
  return await imagekit.upload({
    file: fileBuffer,
    fileName,
  });
};

exports.createService = async (req, res) => {
  try {
    const { servicetitle, titleDescArray, categoryname, categoryImageCounts } = req.body;

    const parsedTitleDesc = JSON.parse(titleDescArray || '[]');
    const parsedCategories = JSON.parse(categoryname || '[]');
    const imageCounts = JSON.parse(categoryImageCounts || '[]');
    const files = req.files || {};

    let serviceImageUrl = null;

    // Upload main service image if provided
    if (files.serviceImage?.length) {
      const file = files.serviceImage[0];
      const uploaded = await uploadToImageKit(file.buffer, file.originalname);
      serviceImageUrl = uploaded.url;
    }

    // Upload category images in sequence based on counts
    const catImages = [];
    let imageIndex = 0;

    for (let count of imageCounts) {
      const images = [];
      for (let i = 0; i < count; i++) {
        const file = files.categoryImages?.[imageIndex++];
        if (file) {
          const uploaded = await uploadToImageKit(file.buffer, file.originalname);
          images.push(uploaded.url);
        }
      }
      catImages.push(images);
    }

    // Construct final category objects
    const finalCategories = parsedCategories.map((cat, idx) => ({
      title: cat.title,
      description: cat.description,
      image: catImages[idx] || [],
    }));

    const newService = new ServicePage({
      servicetitle,
      serviceImage: serviceImageUrl,
      titleDescArray: parsedTitleDesc,
      categoryname: finalCategories,
    });

    await newService.save();

    res.json({ success: true, data: newService });
  } catch (err) {
    console.error("Create Service Error:", err);
    res.status(500).json({ success: false, error: 'Create failed' });
  }
};




// ✅ Get All Services
exports.getAllServices = async (req, res) => {
  try {
    const services = await ServicePage.find();
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Fetch failed' });
  }
};

// ✅ Update Service
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { servicetitle, titleDescArray, categoryname, categoryImageCounts } = req.body;

    const parsedTitleDesc = JSON.parse(titleDescArray || '[]');
    const parsedCategories = JSON.parse(categoryname || '[]');
    const imageCounts = JSON.parse(categoryImageCounts || '[]');
    const files = req.files || {};

    let serviceImageUrl = null;
    if (files.serviceImage?.length) {
      const file = files.serviceImage[0];
      const uploaded = await uploadToImageKit(file.buffer, file.originalname);
      serviceImageUrl = uploaded.url;
    }

    // Smartly map images using imageCounts
    const catImages = [];
    let imageIndex = 0;

    for (let count of imageCounts) {
      const images = [];
      for (let i = 0; i < count; i++) {
        const file = files.categoryImages?.[imageIndex++];
        if (file) {
          const uploaded = await uploadToImageKit(file.buffer, file.originalname);
          images.push(uploaded.url);
        }
      }
      catImages.push(images);
    }

    const finalCategories = parsedCategories.map((cat, idx) => ({
      title: cat.title,
      description: cat.description,
      image: catImages[idx] || [],
    }));

    const updated = await ServicePage.findByIdAndUpdate(
      id,
      {
        servicetitle,
        ...(serviceImageUrl && { serviceImage: serviceImageUrl }),
        titleDescArray: parsedTitleDesc,
        categoryname: finalCategories,
      },
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ success: false, error: 'Update failed' });
  }
};


// ✅ Delete Service
exports.deleteService = async (req, res) => {
  try {
    await ServicePage.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Delete failed' });
  }
};
