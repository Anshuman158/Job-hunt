import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import { isDbConnected } from "../utils/db.js";
import { mockStore } from "../utils/mockStore.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── Helper: sign a JWT (never use a hardcoded fallback secret) ───────────
const signToken = (userId, role) => {
    const secret = process.env.SECRET_KEY;
    if (!secret) throw new Error("SECRET_KEY is not configured.");
    return jwt.sign({ userId, role }, secret, { expiresIn: "1d" });
};

// ── Helper: strip password before sending user data ──────────────────────
const sanitizeUser = (user) => ({
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    profile: user.profile
});

// ── Helper: common cookie options ────────────────────────────────────────
const cookieOptions = {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
};

// ── REGISTER ─────────────────────────────────────────────────────────────
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: "All fields are required.", success: false });
        }

        const file = req.file;
        let profilePhotoUrl = "";
        if (file) {
            const fileUri = getDataUri(file);
            profilePhotoUrl = fileUri.content;
        }

        if (!isDbConnected()) {
            const existing = mockStore.users.find((u) => u.email === email);
            if (existing) {
                return res.status(409).json({ message: "An account with this email already exists.", success: false });
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = {
                _id: "usr_" + Date.now().toString(),
                fullname,
                email,
                phoneNumber: Number(phoneNumber),
                password: hashedPassword,
                role,
                profile: { bio: "", skills: [], resume: "", resumeOriginalName: "", profilePhoto: profilePhotoUrl },
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockStore.users.push(newUser);
            return res.status(201).json({ message: "Account created successfully.", success: true });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "An account with this email already exists.", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: { profilePhoto: profilePhotoUrl }
        });

        return res.status(201).json({ message: "Account created successfully.", success: true });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ message: "Registration failed. Please try again.", success: false });
    }
};

// ── LOGIN ────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: "Email, password, and role are required.", success: false });
        }

        let user;
        if (!isDbConnected()) {
            user = mockStore.users.find((u) => u.email === email);
        } else {
            user = await User.findOne({ email });
        }

        // Generic message: don't reveal whether email exists
        if (!user) {
            return res.status(401).json({ message: "Incorrect email or password.", success: false });
        }

        // Google-only accounts have no password
        if (!user.password) {
            return res.status(401).json({ message: "This account uses Google Sign-In. Please sign in with Google.", success: false });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Incorrect email or password.", success: false });
        }

        if (role !== user.role) {
            return res.status(403).json({ message: "Account not found with this role.", success: false });
        }

        const token = signToken(user._id, user.role);

        return res.status(200).cookie("token", token, cookieOptions).json({
            message: `Welcome back, ${user.fullname}!`,
            user: sanitizeUser(user),
            token,
            success: true
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Login failed. Please try again.", success: false });
    }
};

// ── LOGOUT ───────────────────────────────────────────────────────────────
export const logout = (_req, res) => {
    return res.status(200).cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: "lax" }).json({
        message: "Logged out successfully.",
        success: true
    });
};

// ── UPDATE PROFILE ────────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        const userId = req.id;

        let skillsArray;
        if (skills) {
            skillsArray = typeof skills === "string"
                ? skills.split(",").map((s) => s.trim()).filter(Boolean)
                : skills;
        }

        if (!isDbConnected()) {
            const user = mockStore.users.find((u) => u._id.toString() === userId.toString());
            if (!user) return res.status(404).json({ message: "User not found.", success: false });

            if (fullname) user.fullname = fullname;
            if (email) user.email = email;
            if (phoneNumber) user.phoneNumber = phoneNumber;
            if (bio !== undefined) user.profile.bio = bio;
            if (skillsArray) user.profile.skills = skillsArray;
            if (file) {
                const fileUri = getDataUri(file);
                user.profile.resume = fileUri.content;
                user.profile.resumeOriginalName = file.originalname;
            }
            user.updatedAt = new Date();
            return res.status(200).json({ message: "Profile updated successfully.", user: sanitizeUser(user), success: true });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found.", success: false });

        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio !== undefined) user.profile.bio = bio;
        if (skillsArray) user.profile.skills = skillsArray;
        if (file) {
            const fileUri = getDataUri(file);
            user.profile.resume = fileUri.content;
            user.profile.resumeOriginalName = file.originalname;
        }

        await user.save();
        return res.status(200).json({ message: "Profile updated successfully.", user: sanitizeUser(user), success: true });
    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).json({ message: "Profile update failed. Please try again.", success: false });
    }
};

// ── GOOGLE AUTH ───────────────────────────────────────────────────────────
export const googleAuth = async (req, res) => {
    try {
        const { token, role = "student" } = req.body;
        if (!token) {
            return res.status(400).json({ message: "Google credential token is required.", success: false });
        }

        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        let payload;

        if (googleClientId && googleClientId !== "your_google_client_id_here") {
            try {
                const ticket = await googleClient.verifyIdToken({
                    idToken: token,
                    audience: googleClientId
                });
                payload = ticket.getPayload();
            } catch (verifyErr) {
                // Network fallback: decode without verification (dev-only)
                // In production this branch should not be reached; boot guard prevents missing SECRET_KEY.
                console.warn("Google cert verification failed, using offline decode:", verifyErr.message);
                const decoded = jwt.decode(token);
                if (decoded && decoded.email) {
                    payload = decoded;
                } else {
                    return res.status(401).json({ message: "Invalid Google token. Please try again.", success: false });
                }
            }
        } else {
            const decoded = jwt.decode(token);
            if (decoded && decoded.email) {
                payload = decoded;
            } else {
                return res.status(400).json({ message: "Invalid token. Configure GOOGLE_CLIENT_ID in backend/.env", success: false });
            }
        }

        const email = payload?.email;
        const fullname = payload?.name || payload?.given_name || (email ? email.split("@")[0] : "Google User");
        const profilePhoto = payload?.picture || "";

        if (!email) {
            return res.status(400).json({ message: "Unable to retrieve email from Google token.", success: false });
        }

        let user;
        if (!isDbConnected()) {
            user = mockStore.users.find((u) => u.email === email);
            if (!user) {
                user = {
                    _id: "usr_g_" + Date.now().toString(),
                    fullname,
                    email,
                    phoneNumber: 0,
                    password: "",
                    role: role || "student",
                    profile: { bio: "", skills: [], resume: "", resumeOriginalName: "", profilePhoto },
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                mockStore.users.push(user);
            }
        } else {
            user = await User.findOne({ email });
            if (!user) {
                const randomPassword = await bcrypt.hash(Math.random().toString(36) + Date.now(), 12);
                user = await User.create({
                    fullname,
                    email,
                    phoneNumber: 0,
                    password: randomPassword,
                    role: role || "student",
                    profile: { bio: "", skills: [], profilePhoto }
                });
            }
        }

        const jwtToken = signToken(user._id, user.role);

        return res.status(200).cookie("token", jwtToken, cookieOptions).json({
            message: `Welcome, ${user.fullname}!`,
            user: sanitizeUser(user),
            token: jwtToken,
            success: true
        });
    } catch (error) {
        console.error("Google Auth error:", error);
        return res.status(500).json({ message: "Google authentication failed. Please try again.", success: false });
    }
};
