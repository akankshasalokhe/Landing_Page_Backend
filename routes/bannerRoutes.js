const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.js');
const bannerController = require('../controllers/bannerController');

router.get('/get', bannerController.getBanners);
router.get('/pages', bannerController.getPages);
router.post('/create', upload.single('file'), bannerController.createBanner);
router.put('/update/:id', upload.single('file'), bannerController.updateBanner);
router.delete('/delete/:id', bannerController.deleteBanner);
router.get('/page/:pageName', bannerController.getBannersByPage);


module.exports = router;