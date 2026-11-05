import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, syncLiveJobs } from "../controllers/job.controller.js";
import { validate } from "../middlewares/validate.js";
import { postJobSchema, getJobsQuerySchema } from "../validations/job.validation.js";
import { idParamSchema } from "../validations/common.validation.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, validate(postJobSchema), postJob);
router.route("/get").get(validate(getJobsQuerySchema, "query"), getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/sync-live").get(syncLiveJobs);
router.route("/get/:id").get(validate(idParamSchema, "params"), getJobById);

export default router;
