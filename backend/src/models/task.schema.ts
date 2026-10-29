import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().trim().min(2).max(200),
    description: z.string().trim().min(1).max(5000),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
    dueDate: z.string().datetime().optional().nullable(),
    assigneeId: z.string().optional().nullable(),
});

export const updateTaskSchema = z.object({
    title: z.string().trim().min(2).max(200).optional(),
    description: z.string().trim().min(1).max(5000).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    dueDate: z.string().datetime().nullable().optional(),
    assigneeId: z.string().nullable().optional(),
    status: z.enum([
        'TODO',
        'IN_PROGRESS',
        'IN_REVIEW',
        'COMPLETED',
    ]).optional(),
});

