const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  createServicePage,
  updateServicePage,
  getAllServicePages,
  deleteServicePage
} = require('../controllers/servicePageController');

router.post(
  '/add',
  upload.fields([
    { name: 'serviceImage', maxCount: 1 },
    { name: 'categoryImages', maxCount: 50 },
  ]),
  createServicePage
);

router.put(
  '/update/:id',
  upload.fields([
    { name: 'serviceImage', maxCount: 1 },
    { name: 'categoryImages', maxCount: 50 },
  ]),
  updateServicePage
);

router.get('/get', getAllServicePages);
router.delete('/delete/:id', deleteServicePage);

module.exports = router;