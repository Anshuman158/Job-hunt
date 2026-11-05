import { ZodError } from "zod";
import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

// Global Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";
    let errors = err.errors || [];

    // Handle Zod Validation Errors
    if (err instanceof ZodError) {
        statusCode = 400;
        message = "Validation failed";
        errors = err.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
        }));
    }
    // Handle Mongoose Bad ObjectId (CastError)
    else if (err.name === "CastError") {
        statusCode = 400;
        message = `Resource not found or invalid format: ${err.path}`;
    }
    // Handle Mongoose Duplicate Key Error (Code 11000)
    else if (err.code === 11000) {
        statusCode = 409;
        const duplicateField = Object.keys(err.keyValue || {})[0] || "field";
        message = `An entry with this ${duplicateField} already exists`;
    }
    // Handle Mongoose Validation Error
    else if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Database validation failed";
        errors = Object.values(err.errors || {}).map((e) => ({
            field: e.path,
            message: e.message
        }));
    }
    // Handle Multer Upload Errors
    else if (err instanceof multer.MulterError) {
        statusCode = 400;
        if (err.code === "LIMIT_FILE_SIZE") {
            message = "File is too large. Maximum allowed size is 5MB.";
        } else {
            message = `File upload error: ${err.message}`;
        }
    }
    // Handle JWT Errors
    else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid authentication token";
    } else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Authentication token expired. Please log in again.";
    }

    if (process.env.NODE_ENV !== "test" && statusCode === 500) {
        console.error("Internal Server Error:", err);
    }

    return res.status(statusCode).json({
        success: false,
        message,
        ...(errors.length > 0 && { errors }),
        ...(process.env.NODE_ENV === "development" && statusCode === 500 && { stack: err.stack })
    });
};

