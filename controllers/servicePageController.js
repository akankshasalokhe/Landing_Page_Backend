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
    const { servicetitle, titleDescArray, categoryname } = req.body;
    const parsedTitleDesc = JSON.parse(titleDescArray);
    const parsedCategories = JSON.parse(categoryname);

    const files = req.files || {};
    let serviceImageUrl = null;
    const catImageMap = {};

    // Upload serviceImage
    if (files.serviceImage?.length) {
      const file = files.serviceImage[0];
      const uploaded = await uploadToImageKit(file.buffer, file.originalname);
      serviceImageUrl = uploaded.url;
    }

    // Upload categoryImages
    if (files.categoryImages?.length) {
      for (let file of files.categoryImages) {
        const [prefix] = file.originalname.split("-");
        if (!catImageMap[prefix]) catImageMap[prefix] = [];
        const uploaded = await uploadToImageKit(file.buffer, file.originalname);
        catImageMap[prefix].push(uploaded.url);
      }
    }

    const finalCategories = parsedCategories.map(cat => ({
      title: cat.title,
      description: cat.description,
      image: catImageMap[cat.tempImagePrefix] || [],
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
