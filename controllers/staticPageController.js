const StaticPage = require("../models/staticPageModel");

const allowedTypes = ["privacy-policy", "terms-and-conditions", "return-refund", "about-us"];

exports.getStaticPage = async (req, res) => {
  try {
    const { type } = req.params;
    const page = await StaticPage.findOne({ type });
    res.json(page || { type, content: "" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch page content." });
  }
};

exports.createOrUpdateStaticPage = async (req, res) => {
  try {
    const { type } = req.params;
    const { content } = req.body;

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid page type" });
    }

    let page = await StaticPage.findOne({ type });
    if (!page) {
      page = new StaticPage({ type });
    }

    page.content = content;
    await page.save();

    res.json({ success: true, page });
  } catch (err) {
    res.status(500).json({ error: "Failed to create or update page." });
  }
};
