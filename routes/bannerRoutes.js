const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

router.get('/get', bannerController.getAllBanners);
router.get('/get/:page', bannerController.getBannersByPage);
router.post('/create', bannerController.createBanner);
router.put('/update/:id', bannerController.updateBanner); // <-- ✅ NEW
router.delete('/delete/:id', bannerController.deleteBanner);

module.exports = router;
