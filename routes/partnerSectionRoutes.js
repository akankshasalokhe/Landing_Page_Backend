const express = require('express');
const router = express.Router();
const {
    getPartnerSection,
    uploadPartnerSection,
    updatePartnerSection,
    deletePartnerSection
} = require('../controllers/partnerSectionController');

router.get('/get', getPartnerSection);
router.post('/upload', uploadPartnerSection);
router.put('/update/:id', updatePartnerSection);
router.delete('/delete/:id', deletePartnerSection);

module.exports = router;
