const multer = require("multer");

// Define storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/cvs"); // Store CVs in uploads/cvs directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Define file filter to accept only PDF and DOC formats
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf" || file.mimetype.includes("word")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF and DOC are allowed."), false);
  }
};



// Initialize multer with storage and file filter
const upload = multer({ storage: storage, fileFilter: fileFilter });
module.exports = upload;