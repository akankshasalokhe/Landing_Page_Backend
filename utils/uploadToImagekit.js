// utils/uploadToImageKit.js
// require("dotenv").config();
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});
const uploadToImagekit = async (file, folder) => {
  const uploaded = await imagekit.upload({
    file: file.buffer, // Memory buffer from multer
    fileName: file.originalname,
    folder,
  });
  return uploaded.url;
};

module.exports = uploadToImagekit;
