import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jobhunt";
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 3000
        });
        isConnected = true;
        console.log("MongoDB connected successfully");
    } catch (error) {
        isConnected = false;
        console.warn("MongoDB connection failed or timed out:", error.message);
        console.log("-> Running with built-in high-performance in-memory fallback store!");
        console.log("-> (To use real MongoDB: install mongod or set MONGO_URI in backend/.env)");
    }
};

export const isDbConnected = () => isConnected && mongoose.connection.readyState === 1;

export default connectDB;
