const Banner = require('../models/bannerModel');
const imagekit = require('../imagekitConfig');

const getFileType = (mimetype) => mimetype.startsWith('video') ? 'video' : 'image';

exports.createBanner = async (req, res) => {
  try {
    const { page } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const uploaded = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: 'banners',
      useUniqueFileName: true
    });

    const banner = await Banner.create({
      page,
      imageUrl: uploaded.url,
      imageKitFileId: uploaded.fileId,
      fileType: getFileType(file.mimetype)
    });

    res.status(201).json(banner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { page } = req.body;
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ error: 'Not found' });

    if (req.file) {
      await imagekit.deleteFile(banner.imageKitFileId);

      const uploaded = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: 'banners',
        useUniqueFileName: true
      });

      banner.imageUrl = uploaded.url;
      banner.imageKitFileId = uploaded.fileId;
      banner.fileType = getFileType(req.file.mimetype);
    }

    banner.page = page;
    await banner.save();
    res.json(banner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ error: 'Not found' });
    await imagekit.deleteFile(banner.imageKitFileId);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
};

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
};

exports.getPages = async (req, res) => {
  try {
    const pages = await Banner.distinct('page');
    res.json(pages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
};

exports.getBannersByPage = async (req, res) => {
  try {
    const pageName = req.params.pageName;
    const banners = await Banner.find({ page: pageName }).sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch banners by page' });
  }
};
