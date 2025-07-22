const Partner = require("../models/partnerModel");
const imagekit = require("../imagekitConfig");

// Detect file type
const getFileType = (mimetype) => {
  if (mimetype.startsWith("image")) return "image";
  if (mimetype.startsWith("video")) return "video";
  return "unknown";
};

// Upload helper
const uploadToImageKit = async (file) => {
  return await imagekit.upload({
    file: file.buffer,
    fileName: Date.now() + "_" + file.originalname,
    folder: "partners",
  });
};

// CREATE
exports.createPartner = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    if (!name || !file) return res.status(400).json({ message: "Name and file required" });

    const uploadRes = await uploadToImageKit(file);
    const fileType = getFileType(file.mimetype);

    const partner = new Partner({
      name,
      fileUrl: uploadRes.url,
      fileType,
    });

    await partner.save();
    res.status(201).json(partner);
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

// READ ALL
exports.getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });
    res.json(partners);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

// READ ONE
exports.getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: "Partner not found" });
    res.json(partner);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

// UPDATE
exports.updatePartner = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: "Partner not found" });

    if (file) {
      const uploadRes = await uploadToImageKit(file);
      partner.fileUrl = uploadRes.url;
      partner.fileType = getFileType(file.mimetype);
    }

    partner.name = name || partner.name;
    await partner.save();

    res.json(partner);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// DELETE
exports.deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: "Partner not found" });

    await partner.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
