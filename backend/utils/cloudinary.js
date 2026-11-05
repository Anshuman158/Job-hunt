import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import getDataUri from "./datauri.js";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const isCloudinaryConfigured = () => {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    return Boolean(
        CLOUDINARY_CLOUD_NAME &&
        CLOUDINARY_API_KEY &&
        CLOUDINARY_API_SECRET &&
        CLOUDINARY_CLOUD_NAME !== "your_cloud_name"
    );
};

/**
 * Uploads a file buffer to Cloudinary.
 * Falls back to Base64 DataURI if Cloudinary credentials are not configured.
 *
 * @param {Express.Multer.File} file - Multer in-memory file object
 * @param {Object} options - Upload options (folder, resource_type, etc.)
 * @returns {Promise<{ secure_url: string, public_id: string|null }>}
 */
export const uploadFile = (file, options = {}) => {
    return new Promise((resolve, reject) => {
        if (!file || !file.buffer) {
            return reject(new Error("No file buffer provided for upload"));
        }

        if (!isCloudinaryConfigured()) {
            // Development fallback: Base64 datauri
            const fileUri = getDataUri(file);
            return resolve({
                secure_url: fileUri.content,
                public_id: null
            });
        }

        const uploadOptions = {
            folder: options.folder || "jobhunt",
            resource_type: options.resource_type || "auto",
            ...options
        };

        const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
            if (error) {
                console.error("Cloudinary upload stream error:", error);
                return reject(error);
            }
            resolve({
                secure_url: result.secure_url,
                public_id: result.public_id
            });
        });

        stream.end(file.buffer);
    });
};

/**
 * Deletes a file from Cloudinary by its public ID.
 *
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - "image" | "raw" | "video" (default: "auto")
 * @returns {Promise<Object>}
 */
export const deleteFile = async (publicId, resourceType = "auto") => {
    if (!publicId || !isCloudinaryConfigured()) return null;
    try {
        return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
        console.warn("Failed to delete old file from Cloudinary:", error.message);
        return null;
    }
};

export default cloudinary;

