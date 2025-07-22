const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, enum: ["image", "video"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Partner", partnerSchema);
