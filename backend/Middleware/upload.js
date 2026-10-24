const multer = require('multer');

// Set up multer storage and file naming configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Upload/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });
module.exports = upload;
