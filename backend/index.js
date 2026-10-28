import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

// api routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// health check endpoint
app.get("/api/v1/health", (req, res) => {
    return res.status(200).json({
        message: "Job Hunt Backend is running smoothly",
        success: true
    });
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});
