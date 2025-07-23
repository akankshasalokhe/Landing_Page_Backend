const Count = require('../models/countModel');

// Get all count boxes
exports.getAllCounts = async (req, res) => {
    try {
        const counts = await Count.find();
        res.status(200).json(counts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single count by ID
exports.getCountById = async (req, res) => {
    try {
        const count = await Count.findById(req.params.id);
        if (!count) return res.status(404).json({ message: 'Count not found' });
        res.status(200).json(count);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create new count box
exports.createCount = async (req, res) => {
    try {
        const newCount = new Count(req.body);
        const savedCount = await newCount.save();
        res.status(201).json(savedCount);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update count by ID
exports.updateCount = async (req, res) => {
    try {
        const updatedCount = await Count.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedCount) return res.status(404).json({ message: 'Count not found' });
        res.status(200).json(updatedCount);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete count by ID
exports.deleteCount = async (req, res) => {
    try {
        const deletedCount = await Count.findByIdAndDelete(req.params.id);
        if (!deletedCount) return res.status(404).json({ message: 'Count not found' });
        res.status(200).json({ message: 'Count deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
