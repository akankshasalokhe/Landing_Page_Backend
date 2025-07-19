const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WEBP images and MP4 videos are allowed.'));
    }
  }
});

module.exports = upload;

// const multer = require('multer');
// const storage = multer.memoryStorage(); // Store file in memory
// const upload = multer({ storage });
// module.exports = upload;

