import { z } from 'zod';

export const projectSchema = z.object({
    name: z.string().trim().min(2).max(150),
    description: z.string().trim().min(1).max(5000),
    deadline: z.string().datetime().optional().nullable(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
    memberIds: z.array(z.string().min(1)).optional().default([]),
});

export const memberSchema = z.object({
    userId: z.string().min(1),
});