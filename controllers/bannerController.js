const Banner = require('../models/bannerModel');
const imagekit = require('../imagekitConfig');

exports.getAllBanners = async (req, res) => {
  const banners = await Banner.find();
  res.json(banners);
};

exports.getBannersByPage = async (req, res) => {
  const banners = await Banner.find({ page: req.params.page });
  res.json(banners);
};

exports.createBanner = async (req, res) => {
  const { page, file, fileName } = req.body;

  const upload = await imagekit.upload({
    file,
    fileName
  });

  const banner = new Banner({
    page,
    imageUrl: upload.url,
    imageId: upload.fileId
  });

  await banner.save();
  res.status(201).json(banner);
};

exports.deleteBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) return res.status(404).json({ message: 'Banner not found' });

  await imagekit.deleteFile(banner.imageId);
  await banner.remove();

  res.json({ message: 'Banner deleted' });
};
