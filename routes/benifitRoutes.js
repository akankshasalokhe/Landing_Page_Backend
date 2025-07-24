const express = require('express');
const router = express.Router();
const {
    getAllBenefits,
    getBenefitById,
    createBenefit,
    updateBenefit,
    deleteBenefit,
} = require('../controllers/benefitController');

router.get('/get', getAllBenefits);
router.get('/getbyId/:id', getBenefitById);
router.post('/create', createBenefit);
router.put('/update/:id', updateBenefit);
router.delete('/delete/:id', deleteBenefit);

module.exports = router;
