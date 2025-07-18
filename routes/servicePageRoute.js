const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  createServicePage,
  getAllServicePages,
  updateServicePage,
  deleteServicePage,
} = require('../controllers/servicePageController');

router.post(
  '/add',
  upload.fields([
    { name: 'serviceImage', maxCount: 1 },
    { name: 'categoryImages', maxCount: 10 },
  ]),
  createServicePage
);

router.get('/get', getAllServicePages);

router.put(
  '/update/:id',
  upload.fields([
    { name: 'serviceImage', maxCount: 1 },
    { name: 'categoryImages', maxCount: 10 },
  ]),
  updateServicePage
);

router.delete('/delete/:id', deleteServicePage);

module.exports = router;
