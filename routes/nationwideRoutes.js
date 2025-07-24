const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  createNationWideItem,
  getNationWideItems,
  getNationWideItemById,
  updateNationWideItem,
  deleteNationWideItem,
} = require('../controllers/nationWideController');

// Multer setup
const upload = multer({ dest: 'uploads/' });

router.post(
  '/create',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'arrayofimage', maxCount: 10 },
  ]),
  createNationWideItem
);

router.get('/get', getNationWideItems);
router.get('/getbyId/:id', getNationWideItemById);

router.put(
  '/update/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'arrayofimage', maxCount: 10 },
  ]),
  updateNationWideItem
);

router.delete('/delete/:id', deleteNationWideItem);

module.exports = router;
