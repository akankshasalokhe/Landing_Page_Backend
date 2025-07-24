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
    const {
      servicetitle,
      titleDescArray,
      categoryname,
      categoryImageCounts,
    } = req.body;

    const parsedTitleDesc = JSON.parse(titleDescArray || '[]');
    const parsedCategories = JSON.parse(categoryname || '[]');
    const imageCounts = JSON.parse(categoryImageCounts || '[]');
    const files = req.files || {};

    let serviceImageUrl = null;

    // Upload service image
    if (files.serviceImage?.[0]) {
      const file = files.serviceImage[0];
      const uploaded = await uploadToImageKit(file.buffer, file.originalname);
      serviceImageUrl = uploaded.url;
    }

    // Upload category images in order
    const uploadedCategoryImages = [];
    if (files.categoryImages?.length) {
      for (const file of files.categoryImages) {
        const uploaded = await uploadToImageKit(file.buffer, file.originalname);
        uploadedCategoryImages.push(uploaded.url);
      }
    }

    const finalCategories = [];
    let imageIndex = 0;

    for (let i = 0; i < parsedCategories.length; i++) {
      const count = imageCounts[i] || 0;
      const catImages = uploadedCategoryImages.slice(imageIndex, imageIndex + count);
      finalCategories.push({
        title: parsedCategories[i].title,
        description: parsedCategories[i].description,
        image: catImages,
      });
      imageIndex += count;
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


exports.getAllServices = async (req, res) => {
  try {
    const services = await ServicePage.find();
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Fetch failed' });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await ServicePage.findById(id);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.status(200).json({ success: true, data: service });
  } catch (err) {
    console.error("Get by ID error:", err);
    res.status(500).json({ success: false, error: "Fetch by ID failed" });
  }
};


const getImageKitFileId = (url) => {
  const lastPart = url.split("/").pop();
  return decodeURIComponent(lastPart.split("?")[0]);
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      servicetitle,
      titleDescArray,
      categoryname,
      categoryImageCounts,
    } = req.body;

    const parsedTitleDesc = JSON.parse(titleDescArray || '[]');
    const parsedCategories = JSON.parse(categoryname || '[]');
    const imageCounts = JSON.parse(categoryImageCounts || '[]');
    const files = req.files || {};

    // Fetch existing service to delete old images if needed
    const existingService = await ServicePage.findById(id);

    let serviceImageUrl = existingService.serviceImage;

    // Delete and upload new service image
    if (files.serviceImage?.[0]) {
      if (existingService.serviceImage) {
        const oldServiceFileId = getImageKitFileId(existingService.serviceImage);
        await imagekit.deleteFile(oldServiceFileId);
      }
      const file = files.serviceImage[0];
      const uploaded = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
      });
      serviceImageUrl = uploaded.url;
    }

    // Delete old category images if new ones provided
    const uploadedCategoryImages = [];
    if (files.categoryImages?.length) {
      // Delete all old category images
      for (const cat of existingService.categoryname || []) {
        for (const img of cat.image || []) {
          const oldCatFileId = getImageKitFileId(img);
          await imagekit.deleteFile(oldCatFileId);
        }
      }

      // Upload new ones
      for (const file of files.categoryImages) {
        const uploaded = await imagekit.upload({
          file: file.buffer,
          fileName: file.originalname,
        });
        uploadedCategoryImages.push(uploaded.url);
      }
    }

    // Build final category list
    const finalCategories = [];
    let imageIndex = 0;

    for (let i = 0; i < parsedCategories.length; i++) {
      const count = imageCounts[i] || 0;
      const catImages = uploadedCategoryImages.slice(imageIndex, imageIndex + count);
      finalCategories.push({
        title: parsedCategories[i].title,
        description: parsedCategories[i].description,
        image: catImages,
      });
      imageIndex += count;
    }

    const updatePayload = {
      servicetitle,
      titleDescArray: parsedTitleDesc,
      categoryname: finalCategories.length ? finalCategories : existingService.categoryname,
      serviceImage: serviceImageUrl,
    };

    const updated = await ServicePage.findByIdAndUpdate(id, updatePayload, { new: true });

    res.json({ success: true, data: updated });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, error: 'Update failed' });
  }
};


exports.deleteService = async (req, res) => {
  try {
    await ServicePage.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Delete failed' });
  }
};

exports.getTitles = async (req, res) => {
  try {
    const services = await ServicePage.find({}, { _id: 1, servicetitle: 1 });
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch titles' });
  }
};
