import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

// Allow only PDF, DOC, DOCX (resumes) and common image types (logos)
const allowedMimeTypes = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/svg+xml"
]);

const fileFilter = (_req, file, cb) => {
    if (allowedMimeTypes.has(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                `Unsupported file type: ${path.extname(file.originalname)}. Allowed: PDF, DOC, DOCX, JPG, PNG, WEBP, SVG.`
            ),
            false
        );
    }
};

export const singleUpload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max
}).single("file");

