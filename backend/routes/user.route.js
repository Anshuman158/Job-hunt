import express from "express";
import { login, logout, register, updateProfile, googleAuth } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema, loginSchema, googleAuthSchema, updateProfileSchema } from "../validations/user.validation.js";

const router = express.Router();

router.route("/register").post(singleUpload, validate(registerSchema), register);
router.route("/login").post(validate(loginSchema), login);
router.route("/logout").get(logout);
router.route("/google-auth").post(validate(googleAuthSchema), googleAuth);
router.route("/profile/update").post(isAuthenticated, singleUpload, validate(updateProfileSchema), updateProfile);

export default router;
