const express = require("express");
const router = express.Router();
const {
  getStaticPage,
  createOrUpdateStaticPage,
} = require("../controllers/staticPageController");

// Get page content
router.get("/get/:type", getStaticPage);

// Create or update page content
router.post("/create/:type", createOrUpdateStaticPage);

module.exports = router;
