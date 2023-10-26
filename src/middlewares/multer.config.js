const multer = require('multer');
const path = require('path');
const generateUniqueId = require('generate-unique-id');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads'); // Define the absolute path to the destination directory for uploaded files
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + generateUniqueId({ length: 16, useLetters: false }) + path.extname(file.originalname)); // Customize the filename if necessary
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Allow image mime types
    } else if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('application/')) {
      cb(null, true); // Allow PDF and other application mime types
    } else {
      cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
  },
});

module.exports = upload;
