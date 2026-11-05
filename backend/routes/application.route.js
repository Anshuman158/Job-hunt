import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";
import { validate } from "../middlewares/validate.js";
import { updateApplicationStatusSchema } from "../validations/application.validation.js";
import { idParamSchema } from "../validations/common.validation.js";

const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, validate(idParamSchema, "params"), applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, validate(idParamSchema, "params"), getApplicants);
router.route("/status/:id/update").post(isAuthenticated, validate(idParamSchema, "params"), validate(updateApplicationStatusSchema), updateStatus);

export default router;
