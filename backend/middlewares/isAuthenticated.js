import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY || "jobhunt_super_secret_jwt_key_2026");
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            });
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({
            message: "Authentication failed",
            success: false
        });
    }
};

export default isAuthenticated;
