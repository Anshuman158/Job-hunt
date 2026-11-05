import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.js";
import { validate } from "../middlewares/validate.js";
import { registerCompanySchema, updateCompanySchema } from "../validations/company.validation.js";
import { idParamSchema } from "../validations/common.validation.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, validate(registerCompanySchema), registerCompany);
router.route("/get").get(isAuthenticated, getCompany);
router.route("/get/:id").get(isAuthenticated, validate(idParamSchema, "params"), getCompanyById);
router.route("/update/:id").put(isAuthenticated, validate(idParamSchema, "params"), singleUpload, validate(updateCompanySchema), updateCompany);

export default router;
