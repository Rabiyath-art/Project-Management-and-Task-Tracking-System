import { z } from 'zod';

export const createUserSchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().transform((value) => value.toLowerCase()),
    role: z.enum(["ADMIN", "PROJECT_MANAGER", "MEMBER"]),
});

