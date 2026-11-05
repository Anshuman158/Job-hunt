import { z } from "zod";

export const updateApplicationStatusSchema = z.object({
    status: z.enum(["pending", "accepted", "rejected"], {
        errorMap: () => ({ message: "Status must be 'pending', 'accepted', or 'rejected'" })
    })
});

