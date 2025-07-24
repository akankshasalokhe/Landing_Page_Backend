const PartnerSection = require('../models/partnerSectionModel');
const imagekit = require('../imagekitConfig');

// GET
const getPartnerSection = async (req, res) => {
    try {
        const data = await PartnerSection.find();
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// CREATE
const uploadPartnerSection = async (req, res) => {
    try {
        const { heading, features, imageBase64, fileName } = req.body;

        if (!imageBase64 || !fileName) {
            return res.status(400).json({ success: false, message: 'Image and file name required' });
        }

        const uploadResponse = await imagekit.upload({
            file: imageBase64,
            fileName,
            folder: "partner-section"
        });

        const newEntry = new PartnerSection({
            image: uploadResponse.url,
            heading,
            features
        });

        await newEntry.save();
        res.status(201).json({ success: true, data: newEntry });

    } catch (err) {
        res.status(500).json({ success: false, message: "Upload failed", error: err.message });
    }
};

// UPDATE
const updatePartnerSection = async (req, res) => {
    try {
        const { id } = req.params;
        const { heading, features, imageBase64, fileName } = req.body;

        let updateData = { heading, features };

        if (imageBase64 && fileName) {
            const uploadResponse = await imagekit.upload({
                file: imageBase64,
                fileName,
                folder: "partner-section"
            });
            updateData.image = uploadResponse.url;
        }

        const updated = await PartnerSection.findByIdAndUpdate(id, updateData, { new: true });

        if (!updated) return res.status(404).json({ success: false, message: 'Entry not found' });

        res.status(200).json({ success: true, data: updated });

    } catch (err) {
        res.status(500).json({ success: false, message: "Update failed", error: err.message });
    }
};

// DELETE
const deletePartnerSection = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await PartnerSection.findByIdAndDelete(id);

        if (!deleted) return res.status(404).json({ success: false, message: 'Entry not found' });

        res.status(200).json({ success: true, message: 'Deleted successfully' });

    } catch (err) {
        res.status(500).json({ success: false, message: "Delete failed", error: err.message });
    }
};

module.exports = {
    getPartnerSection,
    uploadPartnerSection,
    updatePartnerSection,
    deletePartnerSection
};
