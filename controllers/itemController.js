// const mongoose = require('mongoose');
// const imagekit = require('../imagekitConfig');
// const Item = require('../models/itemPageModel');

// exports.addItem = async (req, res) => {
//   try {
//     const {
//       heading,
//       subheading,
//       features,
//       feature2,
//       category,
//       description,
//       earning,
//       requirements
//     } = req.body;

//     let featureList = [];
//     let feature2List = [];

//     try {
//       featureList = features ? JSON.parse(features) : [];
//       feature2List = feature2 ? JSON.parse(feature2) : [];
//     } catch (parseError) {
//       return res.status(400).json({
//         error: 'Invalid JSON format in features or feature2',
//         details: parseError.message,
//       });
//     }

//     let imageUrl = null;
//     if (req.files?.image?.[0]) {
//       const uploadedImage = await imagekit.upload({
//         file: req.files.image[0].buffer,
//         fileName: req.files.image[0].originalname,
//       });
//       imageUrl = uploadedImage.url;
//     }

//     const arrayOfImagesList = [];
//     if (req.files?.arrayofimage?.length > 0) {
//       for (const img of req.files.arrayofimage) {
//         const uploaded = await imagekit.upload({
//           file: img.buffer,
//           fileName: img.originalname,
//         });
//         arrayOfImagesList.push(uploaded.url);
//       }
//     }

//     const newItem = new Item({
//       heading,
//       subheading,
//       image: imageUrl,
//       arrayofimage: arrayOfImagesList,
//       features: featureList,
//       feature2: feature2List,
//       category,
//       description,
//       earning,
//       requirements,
//     });

//     await newItem.save();

//     res.status(201).json({
//       message: "Item created successfully",
//       data: newItem,
//     });
//   } catch (error) {
//     console.error('addItem error:', error);
//     res.status(500).json({ error: "Internal Server Error", details: error.message });
//   }
// };

// exports.getAllItems = async (req, res) => {
//   try {
//     const items = await Item.find();
//     res.status(200).json({ data: items });
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error", details: error.message });
//   }
// };

// exports.getItemById = async (req, res) => {
//   try {
//     const item = await Item.findById(req.params.id);
//     if (!item) return res.status(404).json({ error: "Item not found" });
//     res.status(200).json({ data: item });
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error", details: error.message });
//   }
// };

// exports.updateItem = async (req, res) => {
//   try {
//     const {
//       heading, subheading, image, arrayofimage, features,
//       category, description, earning, requirements, feature2
//     } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ error: "Invalid item ID" });
//     }

//     const item = await Item.findById(req.params.id);
//     if (!item) return res.status(404).json({ error: "Item not found" });

//     const updateData = {};
//     if (heading !== undefined) updateData.heading = heading;
//     if (subheading !== undefined) updateData.subheading = subheading;
//     if (features !== undefined) updateData.features = JSON.parse(features);
//     if (category !== undefined) updateData.category = category;
//     if (description !== undefined) updateData.description = description;
//     if (earning !== undefined) updateData.earning = earning;
//     if (requirements !== undefined) updateData.requirements = requirements;
//     if (feature2 !== undefined) updateData.feature2 = JSON.parse(feature2);

//     if (req.files?.image?.[0]) {
//       const uploadedImage = await imagekit.upload({
//         file: req.files.image[0].buffer,
//         fileName: req.files.image[0].originalname
//       });
//       updateData.image = uploadedImage.url;
//     } else if (image !== undefined) {
//       updateData.image = image;
//     }

//     let arrayOfImagesList = item.arrayofimage || [];
//     if (req.files?.arrayofimage?.length > 0) {
//       for (const img of req.files.arrayofimage) {
//         const uploaded = await imagekit.upload({
//           file: img.buffer,
//           fileName: img.originalname
//         });
//         arrayOfImagesList.push(uploaded.url);
//       }
//     }

//     if (arrayofimage !== undefined) {
//       const manualUrls = JSON.parse(arrayofimage);
//       arrayOfImagesList = [...arrayOfImagesList, ...manualUrls];
//     }

//     updateData.arrayofimage = arrayOfImagesList;

//     const updatedItem = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true });
//     res.status(200).json({ message: "Item updated successfully", data: updatedItem });

//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error", details: error.message });
//   }
// };

// exports.addPoint = async (req, res) => {
//   try {
//     const { type, value } = req.body;
//     if (!['features', 'feature2', 'arrayofimage'].includes(type)) {
//       return res.status(400).json({ error: "Invalid type" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ error: "Invalid item ID" });
//     }

//     let update = {};
//     if (type === 'arrayofimage' && req.file) {
//       const uploaded = await imagekit.upload({
//         file: req.file.buffer,
//         fileName: req.file.originalname
//       });
//       update = { $push: { arrayofimage: uploaded.url } };
//     } else if (value) {
//       update = { $push: { [type]: value } };
//     } else {
//       return res.status(400).json({ error: "Value or image required" });
//     }

//     const updated = await Item.findByIdAndUpdate(req.params.id, update, { new: true });
//     if (!updated) return res.status(404).json({ error: "Item not found" });
//     res.status(200).json({ message: "Point added", data: updated });

//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error", details: error.message });
//   }
// };

// exports.removePoint = async (req, res) => {
//   try {
//     const { type, value } = req.body;
//     if (!['features', 'feature2', 'arrayofimage'].includes(type)) {
//       return res.status(400).json({ error: "Invalid type" });
//     }
//     if (!value) return res.status(400).json({ error: "Value required to remove" });

//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ error: "Invalid item ID" });
//     }

//     const update = { $pull: { [type]: value } };
//     const updated = await Item.findByIdAndUpdate(req.params.id, update, { new: true });
//     if (!updated) return res.status(404).json({ error: "Item not found" });

//     res.status(200).json({ message: "Point removed", data: updated });

//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error", details: error.message });
//   }
// };

// exports.deleteItem = async (req, res) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ error: "Invalid item ID" });
//     }

//     const deletedItem = await Item.findByIdAndDelete(req.params.id);
//     if (!deletedItem) return res.status(404).json({ error: "Item not found" });

//     res.status(200).json({ message: "Item deleted successfully" });

//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error", details: error.message });
//   }
// };
