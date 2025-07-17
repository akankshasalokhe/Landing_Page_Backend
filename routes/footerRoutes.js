const express = require('express');
const router = express.Router();
const {
  getFooter,
  createFooter,
  updateFooter,
  deleteFooter,
} = require('../controllers/footerController');

router.get('/get', getFooter);
router.post('/create', createFooter); // optional
router.put('/update', updateFooter);
router.delete('/delete', deleteFooter); // optional

module.exports = router;
