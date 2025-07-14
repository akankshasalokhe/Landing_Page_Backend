const Testimonial = require('../models/testimonialModel');
const imagekit = require('../imagekitConfig');

exports.createTestimonial = async (req, res) => {
  try {
    const { description, name, location, rating } = req.body;

    let imageUrl;
    if (req.file) {
      const uploadRes = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
      });
      imageUrl = uploadRes.url;
    }

    const testimonial = new Testimonial({
      description,
      name,
      location,
      rating,
      image: imageUrl,
    });

    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating testimonial' });
  }
};

exports.getTestimonials = async (req, res) => {
  try {
    const list = await Testimonial.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching testimonials' });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const { description, name, location, rating } = req.body;
    const updateFields = { description, name, location, rating };

    if (req.file) {
      const uploadRes = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
      });
      updateFields.image = uploadRes.url;
    }

    const updated = await Testimonial.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating testimonial' });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting testimonial' });
  }
};
