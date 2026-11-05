import express from "express";
import { 
    login, 
    logout, 
    register, 
    updateProfile, 
    googleAuth, 
    refreshToken,
    forgotPassword,
    resetPassword,
    sendVerificationEmail,
    verifyEmail
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import { validate } from "../middlewares/validate.js";
import { 
    registerSchema, 
    loginSchema, 
    googleAuthSchema, 
    updateProfileSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    tokenParamSchema,
    refreshTokenSchema
} from "../validations/user.validation.js";

const router = express.Router();

// ── Auth Endpoints ──────────────────────────────────────────────────────────
router.route("/register").post(singleUpload, validate(registerSchema), register);
router.route("/login").post(validate(loginSchema), login);
router.route("/logout").get(isAuthenticated, logout);
router.route("/google-auth").post(validate(googleAuthSchema), googleAuth);
router.route("/refresh-token").post(validate(refreshTokenSchema), refreshToken);

// ── Profile Endpoints ───────────────────────────────────────────────────────
router.route("/profile/update").post(isAuthenticated, singleUpload, validate(updateProfileSchema), updateProfile);

// ── Password Reset Endpoints ────────────────────────────────────────────────
router.route("/forgot-password").post(validate(forgotPasswordSchema), forgotPassword);
router.route("/reset-password/:token").post(validate(tokenParamSchema, "params"), validate(resetPasswordSchema), resetPassword);

// ── Email Verification Endpoints ────────────────────────────────────────────
router.route("/send-verification").post(isAuthenticated, sendVerificationEmail);
router.route("/verify-email/:token").get(validate(tokenParamSchema, "params"), verifyEmail);

export default router;
