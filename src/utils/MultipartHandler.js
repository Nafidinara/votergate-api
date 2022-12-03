const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dirPath = 'src/public/assets/storage/';

const storage = (_path) => {
  return multer.diskStorage({
    destination(req, file, callback) {
      if (!fs.existsSync(dirPath + _path)){
        fs.mkdirSync(dirPath + _path, { recursive: true });
      }
      callback(null, dirPath + _path);
    },
    filename(req, file, cb) {
      cb(null, `${new Date().valueOf()}_${file.originalname}`);
    },
  });
};

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Error: Images Only [ jpeg|jpg|png|gif ]!'));
}

module.exports.upload = (_path) => {
  return multer({
    storage: storage(_path),
    limits: { fileSize: 2000000 },
    fileFilter(_req, file, cb) {
      checkFileType(file, cb);
    },
  });
};
