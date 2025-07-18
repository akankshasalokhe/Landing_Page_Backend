const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  createServicePage,
  updateServicePage,
  getAllServicePages,
  getServicePageById,
  deleteServicePage,
} = require('../controllers');

router.post(
  '/add',
  upload.fields([
    { name: 'serviceImage', maxCount: 1 },
    { name: 'categoryImages', maxCount: 20 },
  ]),
  createServicePage
);

router.put(
  '/update/:id',
  upload.fields([
    { name: 'serviceImage', maxCount: 1 },
    { name: 'categoryImages', maxCount: 20 },
  ]),
  updateServicePage
);

router.get('/get', getAllServicePages);
router.get('/get/:id', getServicePageById);
router.delete('/delete/:id', deleteServicePage);

module.exports = router;
