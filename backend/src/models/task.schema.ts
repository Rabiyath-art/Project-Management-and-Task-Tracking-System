import { z } from 'zod';

const dueDateSchema = z.string().datetime({ offset: true }).nullable().optional();

export const createTaskSchema = z.object({
    title: z.string().trim().min(2).max(200),
    description: z.string().trim().max(5000).optional().transform((value) => value || ''),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
    dueDate: dueDateSchema,
    assigneeId: z.string().optional().nullable(),
});

export const updateTaskSchema = z.object({
    title: z.string().trim().min(2).max(200).optional(),
    description: z.string().trim().min(1).max(5000).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    dueDate: dueDateSchema,
    assigneeId: z.string().nullable().optional(),
    status: z.enum([
        'TODO',
        'IN_PROGRESS',
        'IN_REVIEW',
        'COMPLETED',
    ]).optional(),
});

