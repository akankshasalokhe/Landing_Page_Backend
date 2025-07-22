const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const partnerCtrl = require("../controllers/partnerController");

router.post("/create", upload.single("file"), partnerCtrl.createPartner);
router.get("/get", partnerCtrl.getAllPartners);
router.get("/getbyId/:id", partnerCtrl.getPartnerById);
router.put("/update/:id", upload.single("file"), partnerCtrl.updatePartner);
router.delete("/delete/:id", partnerCtrl.deletePartner);

module.exports = router;
