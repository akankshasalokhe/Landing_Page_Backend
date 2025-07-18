const Banner = require('../models/bannerModel');
const imagekit = require('../imagekitConfig');

// GET all banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ message: 'Failed to fetch banners', error: error.message });
  }
};

// GET banners by page
exports.getBannersByPage = async (req, res) => {
  try {
    const banners = await Banner.find({ page: req.params.page });
    res.status(200).json(banners);
  } catch (error) {
    console.error('Error fetching banners by page:', error);
    res.status(500).json({ message: 'Failed to fetch banners', error: error.message });
  }
};

// POST create banner
exports.createBanner = async (req, res) => {
  try {
    const { page, file, fileName } = req.body;
    if (!page || !file || !fileName) {
      return res.status(400).json({ message: 'All fields (page, file, fileName) are required' });
    }

    const upload = await imagekit.upload({ file, fileName });

    const banner = new Banner({
      page,
      imageUrl: upload.url,
      imageId: upload.fileId,
    });

    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ message: 'Failed to create banner', error: error.message });
  }
};

// PUT update banner
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { page, file, fileName } = req.body;

    const banner = await Banner.findById(id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    // Delete old image if new one is provided
    let imageUrl = banner.imageUrl;
    let imageId = banner.imageId;

    if (file && fileName) {
      await imagekit.deleteFile(imageId); // delete old image
      const upload = await imagekit.upload({ file, fileName });
      imageUrl = upload.url;
      imageId = upload.fileId;
    }

    banner.page = page || banner.page;
    banner.imageUrl = imageUrl;
    banner.imageId = imageId;

    await banner.save();
    res.status(200).json(banner);
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ message: 'Failed to update banner', error: error.message });
  }
};

// DELETE banner
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    await imagekit.deleteFile(banner.imageId);
    await banner.remove();

    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ message: 'Failed to delete banner', error: error.message });
  }
};
