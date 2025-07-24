const Benefit = require('../models/benifitModel');
const imagekit = require('../imagekitConfig');

// Get all benefits
const getAllBenefits = async (req, res) => {
    try {
        const benefits = await Benefit.find().sort({ createdAt: -1 });
        res.json(benefits);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single benefit by ID
const getBenefitById = async (req, res) => {
    try {
        const benefit = await Benefit.findById(req.params.id);
        if (!benefit) return res.status(404).json({ message: 'Benefit not found' });
        res.json(benefit);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new benefit
const createBenefit = async (req, res) => {
    try {
        const { heading, description, imageBase64, imageName } = req.body;

        const uploadResponse = await imagekit.upload({
            file: imageBase64,
            fileName: imageName,
            folder: "/benefits",
        });

        const newBenefit = new Benefit({
            heading,
            description,
            imageUrl: uploadResponse.url,
        });

        await newBenefit.save();
        res.status(201).json(newBenefit);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update an existing benefit
const updateBenefit = async (req, res) => {
    try {
        const benefit = await Benefit.findById(req.params.id);
        if (!benefit) return res.status(404).json({ message: 'Benefit not found' });

        const { heading, description, imageBase64, imageName } = req.body;

        benefit.heading = heading || benefit.heading;
        benefit.description = description || benefit.description;

        if (imageBase64 && imageName) {
            const uploadResponse = await imagekit.upload({
                file: imageBase64,
                fileName: imageName,
                folder: "/benefits",
            });
            benefit.imageUrl = uploadResponse.url;
        }

        await benefit.save();
        res.json(benefit);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a benefit
const deleteBenefit = async (req, res) => {
    try {
        const benefit = await Benefit.findByIdAndDelete(req.params.id);
        if (!benefit) return res.status(404).json({ message: 'Benefit not found' });
        res.json({ message: 'Benefit deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllBenefits,
    getBenefitById,
    createBenefit,
    updateBenefit,
    deleteBenefit,
};
