import { z } from "zod";

export const registerCompanySchema = z.object({
    companyName: z.string().trim().min(2, "Company name must be at least 2 characters").max(100)
});

export const updateCompanySchema = z.object({
    name: z.string().trim().min(2).max(100).optional(),
    description: z.string().max(1000).optional(),
    website: z.string().trim().optional(),
    location: z.string().trim().optional()
});

