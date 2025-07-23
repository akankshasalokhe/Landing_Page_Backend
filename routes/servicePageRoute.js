const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  createServicePage,
  updateServicePage,
  getAllServicePages,
  deleteServicePage,
} = require('../controllers/servicePageController');

const fields = [
  { name: 'serviceImage', maxCount: 1 },
  ...Array.from({ length: 10 }, (_, i) => ({ name: `categoryImages${i}`, maxCount: 10 })),
];

router.post('/create', upload.fields(fields), createServicePage);
router.put('/update/:id', upload.fields(fields), updateServicePage);
router.get('/get', getAllServicePages);
router.delete('/delete/:id', deleteServicePage);

module.exports = router;
