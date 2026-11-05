import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
    try {
        const token =
            req.cookies.token ||
            (req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : null);

        if (!token) {
            return res.status(401).json({
                message: "Authentication required. Please log in.",
                success: false,
            });
        }

        const secret = process.env.SECRET_KEY;
        if (!secret) {
            console.error("FATAL: SECRET_KEY is not configured.");
            return res.status(500).json({ message: "Server configuration error.", success: false });
        }

        const decoded = jwt.verify(token, secret);
        req.id = decoded.userId;
        req.role = decoded.role; // available for future role-based checks
        next();
    } catch (error) {
        const isExpired = error.name === "TokenExpiredError";
        return res.status(401).json({
            message: isExpired ? "Session expired. Please log in again." : "Invalid token.",
            success: false,
        });
    }
};

export default isAuthenticated;
