const multer = require('multer');

exports.fileStorage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, "images"); },
  filename: (req, file, cb) => {
    let name = new Date().toISOString() + "-" + file.originalname;
    name = name.replace(/:/g, "_");
    cb(null, name);
  },
});

exports.fileFilter = (req, file, cb) => {
  if (
    file.mimetype==="image/png"||file.mimetype==="image/jpg"||
    file.mimetype==="image/jpeg"
  ) { cb(null, true); } else { cb(null, false); }
};


