const uploadToImageKit = async (file, folder) => {
  const uploaded = await imagekit.upload({
    file: file.buffer,
    fileName: file.originalname,
    folder,
  });
  return uploaded.url;
};

module.exports = uploadToImageKit;
