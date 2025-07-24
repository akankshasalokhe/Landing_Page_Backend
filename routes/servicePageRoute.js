const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const controller = require('../controllers/servicePageController');

router.get('/get', controller.getAllServices);

router.post(
  '/create',
  upload.fields([
    { name: 'serviceImage', maxCount: 1 },
    { name: 'categoryImages', maxCount:100 },
  ]),
  controller.createService
);

router.put(
  '/update/:id',
  upload.fields([
    { name: 'serviceImage', maxCount: 1 },
    { name: 'categoryImages',maxCount:100 },
  ]),
  controller.updateService
);
router.get("/get/:id", controller.getServiceById);

router.delete('/delete/:id', controller.deleteService);
// routes/servicepage.js
router.get("/getAll-titles", async (req, res) => {
  try {
    const services = await ServicePage.find({}, { _id: 1, servicetitle: 1 });
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch titles' });
  }
});

module.exports = router;
