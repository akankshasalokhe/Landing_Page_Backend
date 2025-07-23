const ServicePage = require("../models/servicePageModel");
const imagekit = require("../imagekitConfig");

const uploadToImageKit = async (fileBuffer, fileName) => {
  return await imagekit.upload({
    file: fileBuffer,
    fileName,
  });
};

// CREATE SERVICE
exports.createService = async (req, res) => {
  try {
    const { servicetitle, titleDescArray, categoryname, catImageCounts } = req.body;

    const parsedTitleDesc = JSON.parse(titleDescArray);
    const parsedCategories = JSON.parse(categoryname);
    const imageCounts = JSON.parse(catImageCounts || '[]');
    const categoryImages = req.files?.categoryImages || [];

    let imageIndex = 0;
    const finalCategories = [];

    for (let i = 0; i < parsedCategories.length; i++) {
      const cat = parsedCategories[i];
      const count = imageCounts[i] || 0;
      const images = [];

      for (let j = 0; j < count; j++) {
        const file = categoryImages[imageIndex];
        if (file) {
          const uploaded = await uploadToImageKit(file.buffer, file.originalname);
          images.push(uploaded.url);
          imageIndex++;
        }
      }

      finalCategories.push({
        title: cat.title,
        description: cat.description,
        image: images,
      });
    }

    let serviceImageUrl = null;
    if (req.files?.serviceImage?.[0]) {
      const uploaded = await uploadToImageKit(
        req.files.serviceImage[0].buffer,
        req.files.serviceImage[0].originalname
      );
      serviceImageUrl = uploaded.url;
    }

    const service = await ServicePage.create({
      servicetitle,
      serviceImage: serviceImageUrl,
      titleDescArray: parsedTitleDesc,
      categoryname: finalCategories,
    });

    res.status(201).json({ success: true, data: service });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Create failed" });
  }
};

// GET ALL SERVICES
exports.getAllServices = async (req, res) => {
  try {
    const services = await ServicePage.find();
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, error: "Fetch failed" });
  }
};

// UPDATE SERVICE
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { servicetitle, titleDescArray, categoryname, catImageCounts } = req.body;

    const parsedTitleDesc = JSON.parse(titleDescArray);
    const parsedCategories = JSON.parse(categoryname);
    const imageCounts = JSON.parse(catImageCounts || '[]');
    const categoryImages = req.files?.categoryImages || [];

    let imageIndex = 0;
    const finalCategories = [];

    for (let i = 0; i < parsedCategories.length; i++) {
      const cat = parsedCategories[i];
      const count = imageCounts[i] || 0;
      const images = [];

      for (let j = 0; j < count; j++) {
        const file = categoryImages[imageIndex];
        if (file) {
          const uploaded = await uploadToImageKit(file.buffer, file.originalname);
          images.push(uploaded.url);
          imageIndex++;
        }
      }

      finalCategories.push({
        title: cat.title,
        description: cat.description,
        image: images,
      });
    }

    let serviceImageUrl = null;
    if (req.files?.serviceImage?.[0]) {
      const uploaded = await uploadToImageKit(
        req.files.serviceImage[0].buffer,
        req.files.serviceImage[0].originalname
      );
      serviceImageUrl = uploaded.url;
    }

    const updated = await ServicePage.findByIdAndUpdate(
      id,
      {
        servicetitle,
        serviceImage: serviceImageUrl,
        titleDescArray: parsedTitleDesc,
        categoryname: finalCategories,
      },
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Update failed" });
  }
};

// DELETE SERVICE
exports.deleteService = async (req, res) => {
  try {
    await ServicePage.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: "Delete failed" });
  }
};
