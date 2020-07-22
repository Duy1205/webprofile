  
const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let pathOrigin = path.resolve(__dirname, '../public/images/news');
      cb(null, pathOrigin);
    },
    filename: function (req, file, cb) {
        console.log({ file });
      cb(null, file.originalname)
    }
  })
   
  var upload = multer({ storage: storage });

  exports.uploadMulter = upload;