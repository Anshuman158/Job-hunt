import { z } from "zod";

export const registerSchema = z.object({
    fullname: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
    email: z.string().trim().email("Please provide a valid email address"),
    phoneNumber: z.union([z.string(), z.number()]).transform((val) => Number(val)).refine((val) => !isNaN(val) && String(val).length >= 10, {
        message: "Phone number must be at least 10 digits"
    }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["student", "recruiter"], {
        errorMap: () => ({ message: "Role must be either 'student' or 'recruiter'" })
    })
});

export const loginSchema = z.object({
    email: z.string().trim().email("Please provide a valid email address"),
    password: z.string().min(1, "Password is required"),
    role: z.enum(["student", "recruiter"], {
        errorMap: () => ({ message: "Role must be either 'student' or 'recruiter'" })
    })
});

export const googleAuthSchema = z.object({
    token: z.string().min(1, "Google credential token is required"),
    role: z.enum(["student", "recruiter"]).optional().default("student")
});

export const updateProfileSchema = z.object({
    fullname: z.string().trim().min(2).max(100).optional(),
    email: z.string().trim().email().optional(),
    phoneNumber: z.union([z.string(), z.number()]).optional().transform((val) => (val !== undefined ? Number(val) : undefined)),
    bio: z.string().max(500).optional(),
    skills: z.union([z.string(), z.array(z.string())]).optional()
});

export const forgotPasswordSchema = z.object({
    email: z.string().trim().email("Please provide a valid email address")
});

export const resetPasswordSchema = z.object({
    password: z.string().min(6, "New password must be at least 6 characters")
});

export const tokenParamSchema = z.object({
    token: z.string().min(1, "Token is required")
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().optional()
});
