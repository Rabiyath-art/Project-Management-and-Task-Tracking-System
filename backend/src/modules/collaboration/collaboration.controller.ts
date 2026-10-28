import type { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../../config/prisma.js';

const commentSchema = z.object({
    content: z.string().trim().min(1).max(3000),
});

async function canAccessTask(taskId: string, userId: string, role: string,) {
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            project: role === 'ADMIN' ? {} : {
                OR: [
                    { ownerId: userId },
                    { members: { some: { userId } } },
                ],
            },
        },
        select: { id: true },
    });

    return Boolean(task);
}

// ADD COMMENT
export async function addComment(req: Request, res: Response) {
    const { userId, role } = res.locals.authUser;
    const taskId = req.params.taskId;

    if (typeof taskId !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'Invalid task ID',
        });
    }

    const parsed = commentSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: 'Comment must contain 1–3000 characters',
        });
    }

    try {
        if (!(await canAccessTask(taskId, userId, role))) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        const comment = await prisma.comment.create({
            data: {
                content: parsed.data.content,
                taskId,
                userId,
            },
            include: {
                user: {
                    select: { id: true, name: true },
                },
            },
        });

        return res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: { comment },
        });
    } catch (error) {
        console.error('Add comment error:', error);

        return res.status(500).json({
            success: false,
            message: 'Unable to add comment',
        });
    }
}

// LIST COMMENTS
export async function getComments(req: Request, res: Response) {
    const { userId, role } = res.locals.authUser;
    const taskId = req.params.taskId;

    if (typeof taskId !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'Invalid task ID',
        });
    }

    try {
        if (!(await canAccessTask(taskId, userId, role))) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        const comments = await prisma.comment.findMany({
            where: { taskId },
            orderBy: { createdAt: 'asc' },
            include: {
                user: {
                    select: { id: true, name: true },
                },
            },
        });

        return res.json({
            success: true,
            data: { comments },
        });
    } catch (error) {
        console.error('Get comments error:', error);

        return res.status(500).json({
            success: false,
            message: 'Unable to fetch comments',
        });
    }
}

// GET TASK ACTIVITY HISTORY
export async function getTaskActivities(
    req: Request,
    res: Response,
) {
    const { userId, role } = res.locals.authUser;
    const taskId = req.params.taskId;

    if (typeof taskId !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'Invalid task ID',
        });
    }

    try {
        if (!(await canAccessTask(taskId, userId, role))) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        const activities = await prisma.activity.findMany({
            where: { taskId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true },
                },
            },
        });

        return res.json({
            success: true,
            data: { activities },
        });
    } catch (error) {
        console.error('Get task activities error:', error);

        return res.status(500).json({
            success: false,
            message: 'Unable to fetch activity history',
        });
    }
}