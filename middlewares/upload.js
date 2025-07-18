const multer = require('multer');
const path = require('path');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'temp/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;

// const multer = require('multer');
// const storage = multer.memoryStorage(); // Store file in memory
// const upload = multer({ storage });
// module.exports = upload;
