const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the directory exists
const ensureDirectory = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Reusable Multer configuration function
const createUploader = (uploadPath, allowedFileTypes = /jpeg|jpg|png/, maxFileSize = 2 * 1024 * 1024) => {
    ensureDirectory(uploadPath); // Ensure upload directory exists

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    });

    const fileFilter = (req, file, cb) => {
        const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedFileTypes.test(file.mimetype);

        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb(new Error(`Only ${allowedFileTypes} files are allowed`));
        }
    };

    return multer({
        storage,
        fileFilter,
        limits: { fileSize: maxFileSize },
    });
};

// Create specific upload handlers
const thumbnailUploader = createUploader('./uploads/thumbnails');
const profileUploader = createUploader('./uploads/profiles');

module.exports = {
    thumbnailUploader,
    profileUploader,
};
