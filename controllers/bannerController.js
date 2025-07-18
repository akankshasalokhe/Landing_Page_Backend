const Banner = require('../models/bannerModel');
const imagekit = require('../imagekitConfig');

// Get all banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch banners', error: error.message });
  }
};

// Get banners by page
exports.getBannersByPage = async (req, res) => {
  try {
    const banners = await Banner.find({ page: req.params.page });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch banners by page', error: error.message });
  }
};

// Get unique page names from existing banners
exports.getBannerPages = async (req, res) => {
  try {
    const pages = await Banner.distinct('page');
    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch banner pages', error: error.message });
  }
};

// Create a new banner
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
    res.status(500).json({ message: 'Failed to create banner', error: error.message });
  }
};

// Update a banner
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { page, file, fileName } = req.body;

    const banner = await Banner.findById(id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

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
    res.status(500).json({ message: 'Failed to update banner', error: error.message });
  }
};

// Delete a banner and return updated page list
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    const deletedPage = banner.page;
    await imagekit.deleteFile(banner.imageId);
    await banner.remove();

    // Check if any banners are left for that page
    const remaining = await Banner.find({ page: deletedPage });
    const message = remaining.length === 0 ? 'Banner and empty page removed' : 'Banner deleted';

    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete banner', error: error.message });
  }
};
