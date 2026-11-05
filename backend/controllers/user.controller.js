import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { uploadFile, deleteFile } from "../utils/cloudinary.js";
import { isDbConnected } from "../utils/db.js";
import { mockStore } from "../utils/mockStore.js";
import { sendEmail } from "../utils/sendEmail.js";
import { OAuth2Client } from "google-auth-library";
import { ApiError } from "../utils/ApiError.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── Token Secrets & Lifespans ────────────────────────────────────────────────
const getAccessSecret = () => process.env.SECRET_KEY || "jobhunt_access_secret_key";
const getRefreshSecret = () => process.env.REFRESH_TOKEN_SECRET || `${getAccessSecret()}_refresh`;

// Access token: 15 minutes | Refresh token: 7 days
const signAccessToken = (userId, role) => {
    return jwt.sign({ userId, role }, getAccessSecret(), { expiresIn: "15m" });
};

const signRefreshToken = (userId, role) => {
    return jwt.sign({ userId, role }, getRefreshSecret(), { expiresIn: "7d" });
};

// ── Cookie Options ───────────────────────────────────────────────────────────
const isProd = process.env.NODE_ENV === "production";

const accessTokenCookieOptions = {
    maxAge: 15 * 60 * 1000, // 15 minutes
    httpOnly: true,
    sameSite: "lax",
    secure: isProd
};

const refreshTokenCookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: "lax",
    secure: isProd
};

// ── User Sanitizer ───────────────────────────────────────────────────────────
const sanitizeUser = (user) => ({
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    isVerified: Boolean(user.isVerified),
    profile: user.profile
});

// Helper: Hashing token using SHA-256
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

// ── REGISTER ────────────────────────────────────────────────────────────────
export const register = async (req, res, next) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        const file = req.file;
        let profilePhotoUrl = "";
        let profilePhotoPublicId = "";
        if (file) {
            const uploadRes = await uploadFile(file, { folder: "jobhunt/profiles", resource_type: "image" });
            profilePhotoUrl = uploadRes.secure_url;
            profilePhotoPublicId = uploadRes.public_id || "";
        }

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedVerificationToken = hashToken(rawToken);
        const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        if (!isDbConnected()) {
            const existing = mockStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
            if (existing) {
                return next(new ApiError(409, "An account with this email already exists."));
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = {
                _id: "usr_" + Date.now().toString(),
                fullname,
                email: email.toLowerCase(),
                phoneNumber: Number(phoneNumber),
                password: hashedPassword,
                role,
                isVerified: false,
                verificationToken: hashedVerificationToken,
                verificationTokenExpiry: verificationExpiry,
                refreshToken: "",
                profile: { 
                    bio: "", 
                    skills: [], 
                    resume: "", 
                    resumeOriginalName: "", 
                    resumePublicId: "",
                    profilePhoto: profilePhotoUrl,
                    profilePhotoPublicId
                },
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockStore.users.push(newUser);

            // Send verification email (mock or real)
            const verifyUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/verify-email/${rawToken}`;
            await sendEmail({
                to: email,
                subject: "Verify your Job Hunt account",
                html: `<h1>Welcome to Job Hunt!</h1><p>Please click the link below to verify your email address:</p><a href="${verifyUrl}">${verifyUrl}</a>`
            });

            return res.status(201).json({ 
                message: "Account created successfully. A verification email has been sent.", 
                success: true 
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return next(new ApiError(409, "An account with this email already exists."));
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        await User.create({
            fullname,
            email: email.toLowerCase(),
            phoneNumber,
            password: hashedPassword,
            role,
            isVerified: false,
            verificationToken: hashedVerificationToken,
            verificationTokenExpiry: verificationExpiry,
            profile: { 
                profilePhoto: profilePhotoUrl,
                profilePhotoPublicId
            }
        });

        const verifyUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/verify-email/${rawToken}`;
        await sendEmail({
            to: email,
            subject: "Verify your Job Hunt account",
            html: `<h1>Welcome to Job Hunt!</h1><p>Please click the link below to verify your email address:</p><a href="${verifyUrl}">${verifyUrl}</a>`
        });

        return res.status(201).json({ 
            message: "Account created successfully. A verification email has been sent.", 
            success: true 
        });
    } catch (error) {
        next(error);
    }
};

// ── LOGIN ───────────────────────────────────────────────────────────────────
export const login = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        let user;
        if (!isDbConnected()) {
            user = mockStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        } else {
            user = await User.findOne({ email: email.toLowerCase() });
        }

        if (!user) {
            return next(new ApiError(401, "Incorrect email or password."));
        }

        if (!user.password) {
            return next(new ApiError(401, "This account uses Google Sign-In. Please sign in with Google."));
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return next(new ApiError(401, "Incorrect email or password."));
        }

        if (role !== user.role) {
            return next(new ApiError(403, "Account not found with this role."));
        }

        // Issue tokens
        const accessToken = signAccessToken(user._id, user.role);
        const refreshToken = signRefreshToken(user._id, user.role);

        // Store active refresh token
        user.refreshToken = refreshToken;
        if (isDbConnected()) {
            await user.save();
        }

        return res
            .status(200)
            .cookie("token", accessToken, accessTokenCookieOptions)
            .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
            .json({
                message: `Welcome back, ${user.fullname}!`,
                user: sanitizeUser(user),
                token: accessToken,
                refreshToken,
                success: true
            });
    } catch (error) {
        next(error);
    }
};

// ── REFRESH TOKEN ───────────────────────────────────────────────────────────
export const refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken || req.body.refreshToken;
        if (!token) {
            return next(new ApiError(401, "Refresh token required."));
        }

        let decoded;
        try {
            decoded = jwt.verify(token, getRefreshSecret());
        } catch {
            return next(new ApiError(401, "Invalid or expired refresh token. Please log in again."));
        }

        let user;
        if (!isDbConnected()) {
            user = mockStore.users.find((u) => u._id.toString() === decoded.userId.toString());
        } else {
            user = await User.findById(decoded.userId);
        }

        if (!user || user.refreshToken !== token) {
            return next(new ApiError(401, "Invalid refresh token. Session may have been revoked."));
        }

        // Rotate tokens
        const newAccessToken = signAccessToken(user._id, user.role);
        const newRefreshToken = signRefreshToken(user._id, user.role);

        user.refreshToken = newRefreshToken;
        if (isDbConnected()) {
            await user.save();
        }

        return res
            .status(200)
            .cookie("token", newAccessToken, accessTokenCookieOptions)
            .cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions)
            .json({
                message: "Token refreshed successfully.",
                token: newAccessToken,
                refreshToken: newRefreshToken,
                success: true
            });
    } catch (error) {
        next(error);
    }
};

// ── LOGOUT ──────────────────────────────────────────────────────────────────
export const logout = async (req, res, next) => {
    try {
        const userId = req.id;
        if (userId) {
            if (!isDbConnected()) {
                const user = mockStore.users.find((u) => u._id.toString() === userId.toString());
                if (user) user.refreshToken = "";
            } else {
                await User.findByIdAndUpdate(userId, { refreshToken: "" });
            }
        }

        return res
            .status(200)
            .cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: "lax" })
            .cookie("refreshToken", "", { maxAge: 0, httpOnly: true, sameSite: "lax" })
            .json({
                message: "Logged out successfully.",
                success: true
            });
    } catch (error) {
        next(error);
    }
};

// ── FORGOT PASSWORD ─────────────────────────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const normalizedEmail = email.toLowerCase();

        let user;
        if (!isDbConnected()) {
            user = mockStore.users.find((u) => u.email.toLowerCase() === normalizedEmail);
        } else {
            user = await User.findOne({ email: normalizedEmail });
        }

        // Even if user does not exist, return 200 to prevent user enumeration
        if (!user) {
            return res.status(200).json({
                message: "If an account with that email exists, a password reset link has been sent.",
                success: true
            });
        }

        // Generate secure 32-byte hex token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = hashToken(resetToken);
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpiry = expiry;

        if (isDbConnected()) {
            await user.save();
        }

        const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password/${resetToken}`;
        await sendEmail({
            to: user.email,
            subject: "Password Reset Request - Job Hunt",
            html: `
                <h2>Password Reset Request</h2>
                <p>You requested a password reset for your Job Hunt account.</p>
                <p>Click the link below to set a new password (valid for 15 minutes):</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>If you did not request this, please ignore this email.</p>
            `
        });

        return res.status(200).json({
            message: "If an account with that email exists, a password reset link has been sent.",
            success: true
        });
    } catch (error) {
        next(error);
    }
};

// ── RESET PASSWORD ──────────────────────────────────────────────────────────
export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const hashedToken = hashToken(token);

        let user;
        if (!isDbConnected()) {
            user = mockStore.users.find(
                (u) => u.resetPasswordToken === hashedToken && u.resetPasswordExpiry && new Date(u.resetPasswordExpiry) > new Date()
            );
        } else {
            user = await User.findOne({
                resetPasswordToken: hashedToken,
                resetPasswordExpiry: { $gt: Date.now() }
            });
        }

        if (!user) {
            return next(new ApiError(400, "Password reset token is invalid or has expired."));
        }

        // Hash new password and clear reset tokens
        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        user.resetPasswordToken = "";
        user.resetPasswordExpiry = null;
        user.refreshToken = ""; // Revoke existing sessions

        if (isDbConnected()) {
            await user.save();
        }

        return res.status(200).json({
            message: "Password has been reset successfully. Please log in with your new password.",
            success: true
        });
    } catch (error) {
        next(error);
    }
};

// ── SEND VERIFICATION EMAIL ─────────────────────────────────────────────────
export const sendVerificationEmail = async (req, res, next) => {
    try {
        const userId = req.id;
        let user;
        if (!isDbConnected()) {
            user = mockStore.users.find((u) => u._id.toString() === userId.toString());
        } else {
            user = await User.findById(userId);
        }

        if (!user) return next(new ApiError(404, "User not found."));
        if (user.isVerified) {
            return res.status(200).json({ message: "Your email is already verified.", success: true });
        }

        const rawToken = crypto.randomBytes(32).toString("hex");
        user.verificationToken = hashToken(rawToken);
        user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        if (isDbConnected()) {
            await user.save();
        }

        const verifyUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/verify-email/${rawToken}`;
        await sendEmail({
            to: user.email,
            subject: "Verify your Job Hunt account",
            html: `<h1>Verify your email</h1><p>Click below to verify:</p><a href="${verifyUrl}">${verifyUrl}</a>`
        });

        return res.status(200).json({ message: "Verification email sent.", success: true });
    } catch (error) {
        next(error);
    }
};

// ── VERIFY EMAIL ────────────────────────────────────────────────────────────
export const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;
        const hashedToken = hashToken(token);

        let user;
        if (!isDbConnected()) {
            user = mockStore.users.find(
                (u) => u.verificationToken === hashedToken && u.verificationTokenExpiry && new Date(u.verificationTokenExpiry) > new Date()
            );
        } else {
            user = await User.findOne({
                verificationToken: hashedToken,
                verificationTokenExpiry: { $gt: Date.now() }
            });
        }

        if (!user) {
            return next(new ApiError(400, "Verification link is invalid or has expired."));
        }

        user.isVerified = true;
        user.verificationToken = "";
        user.verificationTokenExpiry = null;

        if (isDbConnected()) {
            await user.save();
        }

        return res.status(200).json({
            message: "Email verified successfully! You can now access all verified features.",
            success: true
        });
    } catch (error) {
        next(error);
    }
};

// ── UPDATE PROFILE ───────────────────────────────────────────────────────────
export const updateProfile = async (req, res, next) => {
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
            if (!user) return next(new ApiError(404, "User not found."));

            if (fullname) user.fullname = fullname;
            if (email) user.email = email.toLowerCase();
            if (phoneNumber) user.phoneNumber = phoneNumber;
            if (bio !== undefined) user.profile.bio = bio;
            if (skillsArray) user.profile.skills = skillsArray;

            if (file) {
                const isImage = file.mimetype.startsWith("image/");
                const folder = isImage ? "jobhunt/profiles" : "jobhunt/resumes";
                const resourceType = isImage ? "image" : "raw";

                const oldPublicId = isImage ? user.profile.profilePhotoPublicId : user.profile.resumePublicId;
                if (oldPublicId) {
                    await deleteFile(oldPublicId, resourceType);
                }

                const uploadRes = await uploadFile(file, { folder, resource_type: resourceType });
                if (isImage) {
                    user.profile.profilePhoto = uploadRes.secure_url;
                    user.profile.profilePhotoPublicId = uploadRes.public_id || "";
                } else {
                    user.profile.resume = uploadRes.secure_url;
                    user.profile.resumeOriginalName = file.originalname;
                    user.profile.resumePublicId = uploadRes.public_id || "";
                }
            }

            user.updatedAt = new Date();
            return res.status(200).json({ message: "Profile updated successfully.", user: sanitizeUser(user), success: true });
        }

        const user = await User.findById(userId);
        if (!user) return next(new ApiError(404, "User not found."));

        if (fullname) user.fullname = fullname;
        if (email) user.email = email.toLowerCase();
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio !== undefined) user.profile.bio = bio;
        if (skillsArray) user.profile.skills = skillsArray;

        if (file) {
            const isImage = file.mimetype.startsWith("image/");
            const folder = isImage ? "jobhunt/profiles" : "jobhunt/resumes";
            const resourceType = isImage ? "image" : "raw";

            const oldPublicId = isImage ? user.profile.profilePhotoPublicId : user.profile.resumePublicId;
            if (oldPublicId) {
                await deleteFile(oldPublicId, resourceType);
            }

            const uploadRes = await uploadFile(file, { folder, resource_type: resourceType });
            if (isImage) {
                user.profile.profilePhoto = uploadRes.secure_url;
                user.profile.profilePhotoPublicId = uploadRes.public_id || "";
            } else {
                user.profile.resume = uploadRes.secure_url;
                user.profile.resumeOriginalName = file.originalname;
                user.profile.resumePublicId = uploadRes.public_id || "";
            }
        }

        await user.save();
        return res.status(200).json({ message: "Profile updated successfully.", user: sanitizeUser(user), success: true });
    } catch (error) {
        next(error);
    }
};

// ── GOOGLE AUTH ──────────────────────────────────────────────────────────────
export const googleAuth = async (req, res, next) => {
    try {
        const { token, role = "student" } = req.body;

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
                console.warn("Google cert verification failed, using offline decode:", verifyErr.message);
                const decoded = jwt.decode(token);
                if (decoded && decoded.email) {
                    payload = decoded;
                } else {
                    return next(new ApiError(401, "Invalid Google token. Please try again."));
                }
            }
        } else {
            const decoded = jwt.decode(token);
            if (decoded && decoded.email) {
                payload = decoded;
            } else {
                return next(new ApiError(400, "Invalid token. Configure GOOGLE_CLIENT_ID in backend/.env"));
            }
        }

        const email = payload?.email?.toLowerCase();
        const fullname = payload?.name || payload?.given_name || (email ? email.split("@")[0] : "Google User");
        const profilePhoto = payload?.picture || "";

        if (!email) {
            return next(new ApiError(400, "Unable to retrieve email from Google token."));
        }

        let user;
        if (!isDbConnected()) {
            user = mockStore.users.find((u) => u.email.toLowerCase() === email);
            if (!user) {
                user = {
                    _id: "usr_g_" + Date.now().toString(),
                    fullname,
                    email,
                    phoneNumber: 0,
                    password: "",
                    role: role || "student",
                    isVerified: true, // Google verified
                    refreshToken: "",
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
                    isVerified: true,
                    profile: { bio: "", skills: [], profilePhoto }
                });
            }
        }

        const accessToken = signAccessToken(user._id, user.role);
        const refreshToken = signRefreshToken(user._id, user.role);

        user.refreshToken = refreshToken;
        if (isDbConnected()) {
            await user.save();
        }

        return res
            .status(200)
            .cookie("token", accessToken, accessTokenCookieOptions)
            .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
            .json({
                message: `Welcome, ${user.fullname}!`,
                user: sanitizeUser(user),
                token: accessToken,
                refreshToken,
                success: true
            });
    } catch (error) {
        next(error);
    }
};
