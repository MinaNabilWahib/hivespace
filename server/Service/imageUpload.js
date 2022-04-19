const multer = require("multer");
const path = require("path");

//customize images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../images"))
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + req.user._id + '_' + Date.now() + path.extname(file.originalname))
    }
});

const imageUpload = multer({
    storage,
    limits: {
        fileSize: 3000000 // 3000000 Bytes = 3 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }
        cb(null, true)
    }
});

exports.avatar = imageUpload.single("image");