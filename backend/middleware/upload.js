import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cấu hình storage tạm thời
const storage = multer.memoryStorage(); // Lưu file trong memory thay vì disk

// Kiểm tra loại file
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
};

export const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Giới hạn file 5MB
    fileFilter: fileFilter
});

// Middleware xử lý chuyển đổi ảnh sang webp
export const processImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }

        // Tạo tên file mới
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
        const filepath = path.join(__dirname, '..', 'uploads', filename);

        // Xử lý và lưu ảnh
        await sharp(req.file.buffer)
            .webp({ quality: 80 }) // Chuyển đổi sang webp với chất lượng 80%
            .resize(1200, 1200, { // Giới hạn kích thước tối đa
                fit: 'inside',
                withoutEnlargement: true
            })
            .toFile(filepath);

        // Thêm thông tin file đã xử lý vào request
        req.processedImage = {
            filename: filename,
            filepath: filepath
        };

        next();
    } catch (error) {
        next(error);
    }
};