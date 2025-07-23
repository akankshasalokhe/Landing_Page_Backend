const ServicePage = require('../models/servicePageModel');
const uploadToImageKit = require('../utils/uploadToImagekit');

// Create
exports.createServicePage = async (req, res) => {
  try {
    const { servicetitle, titleDescArray, categoryMeta } = req.body;
    const parsedCategories = JSON.parse(categoryMeta);
    const parsedTitleDesc = JSON.parse(titleDescArray);

    const filesMap = {};
    req.files.forEach(file => {
      filesMap[file.fieldname] = file;
    });

    // Upload service image
    const serviceImg = filesMap['serviceImage'];
    const serviceImageUrl = serviceImg
      ? await uploadToImageKit(serviceImg, `service-page/main`)
      : '';

    // Upload category images and build array
    const categories = await Promise.all(parsedCategories.map(async (cat, index) => {
      const catFile = filesMap[`categoryImage_${index}`];
      const imageUrl = catFile
        ? await uploadToImageKit(catFile, `service-page/category/${cat.title}`)
        : '';

      return {
        title: cat.title,
        description: cat.description,
        image: [imageUrl],
      };
    }));

    const newService = new ServicePage({
      servicetitle,
      serviceImage: serviceImageUrl,
      titleDescArray: parsedTitleDesc,
      categoryname: categories,
    });

    await newService.save();
    res.status(201).json({ message: 'Service Page created', data: newService });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating service page', details: err.message });
  }
};

// Get All
exports.getAllServicePages = async (req, res) => {
  try {
    const data = await ServicePage.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

// Get By ID
exports.getServicePageById = async (req, res) => {
  try {
    const data = await ServicePage.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

// Update
exports.updateServicePage = async (req, res) => {
  try {
    const { servicetitle, titleDescArray, categoryMeta } = req.body;
    const parsedCategories = JSON.parse(categoryMeta);
    const parsedTitleDesc = JSON.parse(titleDescArray);

    const filesMap = {};
    req.files.forEach(file => {
      filesMap[file.fieldname] = file;
    });

    const serviceImg = filesMap['serviceImage'];
    const serviceImageUrl = serviceImg
      ? await uploadToImageKit(serviceImg, `service-page/main`)
      : null;

    const categories = await Promise.all(parsedCategories.map(async (cat, index) => {
      const catFile = filesMap[`categoryImage_${index}`];
      const imageUrl = catFile
        ? await uploadToImageKit(catFile, `service-page/category/${cat.title}`)
        : cat.image?.[0] || '';

      return {
        title: cat.title,
        description: cat.description,
        image: [imageUrl],
      };
    }));

    const updated = await ServicePage.findByIdAndUpdate(
      req.params.id,
      {
        servicetitle,
        serviceImage: serviceImageUrl || undefined,
        titleDescArray: parsedTitleDesc,
        categoryname: categories,
      },
      { new: true }
    );

    res.json({ message: 'Updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update', details: err.message });
  }
};

// Delete
exports.deleteServicePage = async (req, res) => {
  try {
    const deleted = await ServicePage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
};
