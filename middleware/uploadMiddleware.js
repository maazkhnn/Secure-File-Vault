const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024, //20mb
    },
    fileFilter: (req, file, cb) => {
        const allowed = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'text/plain',
        'application/zip'
        ];
        if (!allowed.includes(file.mimetype)) {
        return cb(new Error('Unsupported file type'), false);
        }
        cb(null, true);
    }
});

module.exports = upload;