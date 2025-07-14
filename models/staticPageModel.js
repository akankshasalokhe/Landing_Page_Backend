// models/StaticPage.js
const mongoose = require("mongoose");

const StaticPageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["privacy-policy", "terms-and-conditions", "return-refund", "about-us"],
      required: true,
      unique: true, // one entry per type
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StaticPage", StaticPageSchema);
