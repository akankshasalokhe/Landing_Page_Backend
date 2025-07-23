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
    } = req.body;

    const parsedTitleDesc = JSON.parse(titleDescArray);
    const parsedCategories = JSON.parse(categoryname);

    const files = req.files || [];
    let serviceImageUrl = null;
    const catImageMap = {};

    for (let file of files) {
      if (file.fieldname === 'serviceImage') {
        const uploaded = await uploadToImageKit(file.buffer, file.originalname);
        serviceImageUrl = uploaded.url;
      } else if (file.fieldname === 'categoryImages') {
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

    const service = await ServicePage.create({
      servicetitle,
      serviceImage: serviceImageUrl,
      titleDescArray: parsedTitleDesc,
      categoryname: finalCategories,
    });

    res.status(201).json({ success: true, data: service });
  } catch (err) {
    console.error(err);
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

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      servicetitle,
      titleDescArray,
      categoryname,
    } = req.body;

    const parsedTitleDesc = JSON.parse(titleDescArray);
    const parsedCategories = JSON.parse(categoryname);

    const files = req.files || [];
    let serviceImageUrl = null;
    const catImageMap = {};

    for (let file of files) {
      if (file.fieldname === 'serviceImage') {
        const uploaded = await uploadToImageKit(file.buffer, file.originalname);
        serviceImageUrl = uploaded.url;
      } else if (file.fieldname === 'categoryImages') {
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
        serviceImage: serviceImageUrl,
        titleDescArray: parsedTitleDesc,
        categoryname: finalCategories,
      },
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
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
