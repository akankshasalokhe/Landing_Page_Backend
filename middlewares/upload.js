// middlewares/upload.js
const multer = require('multer');

const storage = multer.memoryStorage(); // ensure memory storage is used

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;


module.exports = upload;

// const multer = require('multer');
// const storage = multer.memoryStorage(); // Store file in memory
// const upload = multer({ storage });
// module.exports = upload;

