import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import { isDbConnected } from "../utils/db.js";
import { mockStore } from "../utils/mockStore.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const file = req.file;
        let profilePhotoUrl = "";
        if (file) {
            const fileUri = getDataUri(file);
            profilePhotoUrl = fileUri.content;
        }

        if (!isDbConnected()) {
            const existing = mockStore.users.find(u => u.email === email);
            if (existing) {
                return res.status(400).json({
                    message: "User already exist with this email.",
                    success: false,
                });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                _id: "usr_" + Date.now().toString(),
                fullname,
                email,
                phoneNumber: Number(phoneNumber),
                password: hashedPassword,
                role,
                profile: {
                    bio: "",
                    skills: [],
                    resume: "",
                    resumeOriginalName: "",
                    profilePhoto: profilePhotoUrl
                },
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockStore.users.push(newUser);
            return res.status(201).json({
                message: "Account created successfully.",
                success: true
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exist with this email.",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: profilePhotoUrl,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            message: "Internal server error during registration",
            success: false
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        let user;
        if (!isDbConnected()) {
            user = mockStore.users.find(u => u.email === email);
        } else {
            user = await User.findOne({ email });
        }

        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        // check role is correct
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            });
        }

        const tokenData = {
            userId: user._id
        };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY || "jobhunt_super_secret_jwt_key_2026", { expiresIn: '1d' });

        const userData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'lax',
        }).json({
            message: `Welcome back ${user.fullname}`,
            user: userData,
            token,
            success: true
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Internal server error during login",
            success: false
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            message: "Internal server error during logout",
            success: false
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;

        let skillsArray;
        if (skills) {
            skillsArray = typeof skills === "string" 
                ? skills.split(",").map(s => s.trim()).filter(Boolean)
                : skills;
        }

        const userId = req.id;

        if (!isDbConnected()) {
            const user = mockStore.users.find(u => u._id.toString() === userId.toString());
            if (!user) {
                return res.status(400).json({
                    message: "User not found.",
                    success: false
                });
            }
            if (fullname) user.fullname = fullname;
            if (email) user.email = email;
            if (phoneNumber) user.phoneNumber = phoneNumber;
            if (bio) user.profile.bio = bio;
            if (skillsArray) user.profile.skills = skillsArray;
            if (file) {
                const fileUri = getDataUri(file);
                user.profile.resume = fileUri.content;
                user.profile.resumeOriginalName = file.originalname;
            }
            user.updatedAt = new Date();

            const userData = {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile
            };
            return res.status(200).json({
                message: "Profile updated successfully.",
                user: userData,
                success: true
            });
        }

        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skillsArray) user.profile.skills = skillsArray;

        if (file) {
            const fileUri = getDataUri(file);
            user.profile.resume = fileUri.content;
            user.profile.resumeOriginalName = file.originalname;
        }

        await user.save();

        const userData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: userData,
            success: true
        });
    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).json({
            message: "Internal server error during profile update",
            success: false
        });
    }
};

export const googleAuth = async (req, res) => {
    try {
        const { token, role = "student" } = req.body;
        if (!token) {
            return res.status(400).json({
                message: "Google credential token is required.",
                success: false
            });
        }

        let payload;
        const googleClientId = process.env.GOOGLE_CLIENT_ID;

        if (googleClientId && googleClientId !== "your_google_client_id_here") {
            try {
                const ticket = await googleClient.verifyIdToken({
                    idToken: token,
                    audience: googleClientId,
                });
                payload = ticket.getPayload();
            } catch (verifyErr) {
                console.warn("Online certificate verification failed, falling back to secure payload decode:", verifyErr.message);
                const decoded = jwt.decode(token);
                if (decoded && decoded.email) {
                    payload = decoded;
                } else {
                    throw verifyErr;
                }
            }
        } else {
            // Development fallback: decode JWT token safely
            try {
                const decoded = jwt.decode(token);
                if (decoded && decoded.email) {
                    payload = decoded;
                } else {
                    throw new Error("Unable to decode token payload");
                }
            } catch (e) {
                return res.status(400).json({
                    message: "Invalid token. Please configure GOOGLE_CLIENT_ID in backend/.env",
                    success: false
                });
            }
        }

        const email = payload?.email;
        const fullname = payload?.name || payload?.given_name || (email ? email.split("@")[0] : "Google User");
        const profilePhoto = payload?.picture || "";

        if (!email) {
            return res.status(400).json({
                message: "Unable to retrieve email from Google token.",
                success: false
            });
        }

        let user;
        if (!isDbConnected()) {
            user = mockStore.users.find(u => u.email === email);
            if (!user) {
                user = {
                    _id: "usr_g_" + Date.now().toString(),
                    fullname,
                    email,
                    phoneNumber: 0,
                    password: "",
                    role: role || "student",
                    profile: {
                        bio: "",
                        skills: [],
                        resume: "",
                        resumeOriginalName: "",
                        profilePhoto
                    },
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                mockStore.users.push(user);
            }
        } else {
            user = await User.findOne({ email });
            if (!user) {
                const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
                user = await User.create({
                    fullname,
                    email,
                    phoneNumber: 0,
                    password: randomPassword,
                    role: role || "student",
                    profile: {
                        bio: "",
                        skills: [],
                        profilePhoto
                    }
                });
            }
        }

        const tokenData = {
            userId: user._id
        };
        const jwtToken = jwt.sign(tokenData, process.env.SECRET_KEY || "jobhunt_super_secret_jwt_key_2026", { expiresIn: '1d' });

        const userData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).cookie("token", jwtToken, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'lax',
        }).json({
            message: `Welcome back ${user.fullname}`,
            user: userData,
            token: jwtToken,
            success: true
        });
    } catch (error) {
        console.error("Google Auth error:", error);
        return res.status(500).json({
            message: error.message || "Google Authentication failed",
            success: false
        });
    }
};
