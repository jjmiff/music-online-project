const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Use memory storage to process file with sharp
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// Middleware to process image
const processImage = async (req, res, next) => {
    if (!req.file) return next();

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filenameBase = 'vinyl-' + uniqueSuffix;
    const largeFilename = filenameBase + '-large.webp';
    const thumbFilename = filenameBase + '-thumb.webp';

    try {
        // Generate Large Image
        await sharp(req.file.buffer)
            .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(path.join(uploadDir, largeFilename));

        // Generate Thumbnail
        await sharp(req.file.buffer)
            .resize(400, 400, { fit: 'cover' })
            .webp({ quality: 80 })
            .toFile(path.join(uploadDir, thumbFilename));

        // Update req.file to match what the controller expects
        req.file.filename = largeFilename;
        req.file.path = path.join(uploadDir, largeFilename);

        next();
    } catch (error) {
        console.error('Image processing error:', error);
        res.status(500).json({ error: 'Error processing image' });
    }
};

module.exports = {
    upload: upload,
    processImage: processImage
};
