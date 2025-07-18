const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const upload = require('../middlewares/upload.js');

router.get('/get', bannerController.getAllBanners);
router.get('/pages', bannerController.getBannerPages);
router.get('/:page', bannerController.getBannersByPage);
router.post('/create', upload.single('file'), bannerController.createBanner);
router.put('/update/:id', upload.single('file'), bannerController.updateBanner);
router.delete('/delete/:id', bannerController.deleteBanner);

module.exports = router;