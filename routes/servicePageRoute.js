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

module.exports = router;
