import { z } from "zod";
import { objectIdSchema } from "./common.validation.js";

export const postJobSchema = z.object({
    title: z.string().trim().min(2, "Job title must be at least 2 characters").max(150),
    description: z.string().trim().min(10, "Job description must be at least 10 characters"),
    requirements: z.union([z.string(), z.array(z.string())]),
    salary: z.coerce.number().min(0, "Salary must be a positive number"),
    location: z.string().trim().min(2, "Location is required"),
    jobType: z.string().trim().min(2, "Job type is required"),
    experience: z.coerce.number().min(0, "Experience must be 0 or greater").optional(),
    experienceLevel: z.coerce.number().min(0).optional(),
    position: z.coerce.number().int().min(1, "Positions must be at least 1").default(1),
    companyId: objectIdSchema,
    applyUrl: z.string().trim().optional()
}).refine((data) => data.experience !== undefined || data.experienceLevel !== undefined, {
    message: "Experience level is required",
    path: ["experience"]
});

export const getJobsQuerySchema = z.object({
    keyword: z.string().optional().default(""),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(12)
});

