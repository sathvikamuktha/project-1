const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/img')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });

  const fileFilter = (req, file, cb) => {
    const mimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (mimeTypes.includes(file.mimetype)) {
        return cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only jpg, png, and gif image files are allowed'), false);
    }
};


const upload = multer({storage,
                        fileFilter,
                        limits: {fileSize: 2*1024*1024}
                    }).single('image');

exports.fileUpload = (req, res, next) => {
  upload(req, res, err => {
    if (err) {
      err.status = 400;
      next(err);
    } else {
      next();
    }
  });
}