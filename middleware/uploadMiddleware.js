const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024, //100MB hard ceiling; flag enforces lower caps
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