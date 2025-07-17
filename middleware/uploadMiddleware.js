const multer = require('multer');
const path = require('path'); // helps you safely work with file paths and extensions across OS

const storage = multer.diskStorage({   //multer.memoryStorage saves as a Buffer on req.file.buffer (e.g for S3)
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); //cb finishes your decision making about file; a callback you MUST call with either error or result to tell Multer
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9); // timestamp + randomness
        cb(null, unique + path.extname(file.originalname)); //the path.extname() extracts file extension
    }
});

const upload = multer({ storage: storage });
// this creates the actual upload middleware that'll be used in routes

module.exports = upload;