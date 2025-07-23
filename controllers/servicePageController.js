const ServicePage = require("../models/servicePageModel");
const imagekit = require("../imagekitConfig");

const uploadToImageKit = async (fileBuffer, fileName) => {
  return await imagekit.upload({
    file: fileBuffer,
    fileName,
  });
};

// ✅ Create Service
exports.createService = async (req, res) => {
  try {
    const {
      servicetitle,
      titleDescArray,
      categoryname,
      catImageCounts,
    } = req.body;

    const parsedTitleDesc = JSON.parse(titleDescArray);
    const parsedCategories = JSON.parse(categoryname);
    const parsedCounts = JSON.parse(catImageCounts || '[]');

    const files = req.files || {};
    const serviceImageFile = files.serviceImage?.[0];
    const categoryImageFiles = files.categoryImages || [];

    // Upload service image
    let serviceImageUrl = null;
    if (serviceImageFile) {
      const uploaded = await uploadToImageKit(serviceImageFile.buffer, serviceImageFile.originalname);
      serviceImageUrl = uploaded.url;
    }

    // Upload category images
    const uploadedCatImages = [];
    for (let file of categoryImageFiles) {
      const uploaded = await uploadToImageKit(file.buffer, file.originalname);
      uploadedCatImages.push(uploaded.url);
    }

    // Group images by count
    const finalCategories = [];
    let index = 0;
    for (let i = 0; i < parsedCategories.length; i++) {
      const count = parsedCounts[i] || 0;
      const catImages = uploadedCatImages.slice(index, index + count);
      finalCategories.push({
        title: parsedCategories[i].title,
        description: parsedCategories[i].description,
        image: catImages,
      });
      index += count;
    }

    const service = await ServicePage.create({
      servicetitle,
      serviceImage: serviceImageUrl,
      titleDescArray: parsedTitleDesc,
      categoryname: finalCategories,
    });

    res.status(201).json({ success: true, data: service });
  } catch (err) {
    console.error("Create error:", err);
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
