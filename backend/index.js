import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import sanitizeMongo from "./middlewares/sanitizeMongo.js";
import hpp from "hpp";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

// Guard: refuse to boot without a real SECRET_KEY in production
if (process.env.NODE_ENV === "production" && !process.env.SECRET_KEY) {
    console.error("FATAL: SECRET_KEY env variable is not set. Refusing to start in production.");
    process.exit(1);
}

const app = express();

// ── Security headers (Helmet) ──────────────────────────────────────────────
app.use(helmet());

// ── CORS ───────────────────────────────────────────────────────────────────
const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (
            !origin ||
            allowedOrigins.includes(origin) ||
            origin.startsWith("http://localhost:") ||
            origin.startsWith("http://127.0.0.1:")
        ) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
};
app.use(cors(corsOptions));

// ── Body parsers (with size limits) ───────────────────────────────────────
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

// ── NoSQL-injection sanitization (body & params only — Express 5 compat) ──
app.use(sanitizeMongo);

// ── HTTP Parameter Pollution protection ───────────────────────────────────
app.use(hpp());

// ── Global rate limiter (all /api routes) ─────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 200,                   // 200 requests per window per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later.", success: false }
});
app.use("/api/", globalLimiter);

// ── Stricter limiter for auth endpoints ───────────────────────────────────
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 20,                    // only 20 login/register attempts per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many authentication attempts, please try again after 15 minutes.", success: false }
});
app.use("/api/v1/user/login", authLimiter);
app.use("/api/v1/user/register", authLimiter);
app.use("/api/v1/user/google-auth", authLimiter);

// ── API routes ─────────────────────────────────────────────────────────────
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// ── Health check ──────────────────────────────────────────────────────────
app.get("/api/v1/health", (_req, res) => {
    return res.status(200).json({
        message: "Job Hunt Backend is running smoothly",
        success: true,
        env: process.env.NODE_ENV || "development"
    });
});

import { errorHandler } from "./middlewares/error.middleware.js";

// ── Global 404 handler ────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ message: "Route not found", success: false });
});

// ── Global error handler ──────────────────────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
