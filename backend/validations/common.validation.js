import { z } from "zod";

// Validates 24-character hex MongoDB ObjectId or mock ID
export const objectIdSchema = z.string().refine(
    (val) => /^[0-9a-fA-F]{24}$/.test(val) || val.startsWith("cmp_") || val.startsWith("job_") || val.startsWith("app_") || val.startsWith("usr_") || val.startsWith("real_") || val.startsWith("remotive_") || val.startsWith("arbeit_"),
    { message: "Invalid ID format" }
);

export const idParamSchema = z.object({
    id: objectIdSchema
});

export const paginationQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(12),
    keyword: z.string().optional().default("")
});

