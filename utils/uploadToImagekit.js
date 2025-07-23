// utils/uploadToImageKit.js
const uploadToImagekit = async (file, folder) => {
  const uploaded = await imagekit.upload({
    file: file.buffer, // Memory buffer from multer
    fileName: file.originalname,
    folder,
  });
  return uploaded.url;
};

module.exports = uploadToImagekit;
