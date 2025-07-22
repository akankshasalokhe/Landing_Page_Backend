const express = require('express');
const router = express.Router();
const controller = require('../controllers/EarningInfoController');

router.post('/submit', controller.createBusinessInfo);
router.get('/get', controller.getAllBusinessInfos);
router.get('/getbyId/:id', controller.getBusinessInfoById);
router.put('/update/:id', controller.updateBusinessInfo);
router.delete('/delete/:id', controller.deleteBusinessInfo);

module.exports = router;
