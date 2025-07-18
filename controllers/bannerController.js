const Banner = require('../models/bannerModel');
const imagekit = require('../imagekitConfig');
const mime = require('mime-types');

exports.getAllBanners = async (req, res) => {
  const banners = await Banner.find();
  res.json(banners);
};

exports.getBannersByPage = async (req, res) => {
  const banners = await Banner.find({ page: req.params.page });
  res.json(banners);
};

exports.getBannerPages = async (req, res) => {
  const banners = await Banner.find({}, 'page');
  const pages = [...new Set(banners.map(b => b.page))];
  res.json(pages);
};

exports.createBanner = async (req, res) => {
  try {
    const { page } = req.body;
    const file = req.file;

    if (!file || !page) return res.status(400).json({ message: 'Missing file or page' });

    const mimeType = mime.lookup(file.originalname);
    const isVideo = mimeType.startsWith('video');

    const upload = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: '/banners'
    });

    const newBanner = new Banner({
      page,
      imageUrl: upload.url,
      imageKitFileId: upload.fileId,
      fileType: isVideo ? 'video' : 'image'
    });

    await newBanner.save();
    res.status(201).json(newBanner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed' });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { page } = req.body;
    const file = req.file;

    const banner = await Banner.findById(id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    if (file) {
      if (banner.imageKitFileId) {
        await imagekit.deleteFile(banner.imageKitFileId);
      }

      const mimeType = mime.lookup(file.originalname);
      const isVideo = mimeType.startsWith('video');

      const upload = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: '/banners'
      });

      banner.imageUrl = upload.url;
      banner.imageKitFileId = upload.fileId;
      banner.fileType = isVideo ? 'video' : 'image';
    }

    banner.page = page;
    await banner.save();

    res.status(200).json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Update failed' });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Not found' });

    if (banner.imageKitFileId) {
      await imagekit.deleteFile(banner.imageKitFileId);
    }

    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Deletion failed' });
  }
};
