import type { Request, Response } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import prisma from '../../config/prisma.js';

const taskStatuses = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED'] as const;
type TaskStatus = (typeof taskStatuses)[number];

const createTaskSchema = z.object({
    title: z.string().trim().min(2).max(200),
    description: z.string().trim().min(1).max(5000),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
    dueDate: z.string().datetime().optional().nullable(),
    assigneeId: z.string().optional().nullable(),
});

const updateTaskSchema = z.object({
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

async function getAccessibleProject(
    projectId: string,
    userId: string,
    role: string,
) {
    return prisma.project.findFirst({
        where: {
            id: projectId,
            isArchived: false,
            ...(role === 'ADMIN'
                ? {}
                : {
                    OR: [
                        { ownerId: userId },
                        { members: { some: { userId } } },
                    ],
                }),
        },
        select: { id: true, ownerId: true },
    });
}

async function isProjectManager(
    projectId: string,
    userId: string,
    role: string,
) {
    if (role === 'ADMIN') return true;
    if (role !== 'PROJECT_MANAGER') return false;

    const project = await prisma.project.findFirst({
        where: { id: projectId, ownerId: userId },
        select: { id: true },
    });

    return Boolean(project);
}

async function isMember(projectId: string, userId: string) {
    const membership = await prisma.projectMember.findUnique({
        where: {
            projectId_userId: { projectId, userId },
        },
        select: { userId: true },
    });

    return Boolean(membership);
}

// CREATE TASK
export async function createTask(req: Request, res: Response) {
    const { userId, role } = res.locals.authUser;
    const projectId = req.params.projectId;

    if (typeof projectId !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'Invalid project ID',
        });
    }

    const parsed = createTaskSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: 'Invalid task details',
            errors: parsed.error.issues,
        });
    }

    try {
        const project = await getAccessibleProject(projectId, userId, role);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found or inaccessible',
            });
        }

        const manager = await isProjectManager(projectId, userId, role);

        if (!manager) {
            return res.status(403).json({
                success: false,
                message: 'Only the project manager or admin can create tasks',
            });
        }

        const { assigneeId, dueDate, ...fields } = parsed.data;

        if (assigneeId) {
            if (!(await isMember(projectId, assigneeId))) {
                return res.status(400).json({
                    success: false,
                    message: 'Assignee must be a project member',
                });
            }
        }

        const task = await prisma.$transaction(async (tx: any) => {
            const created = await tx.task.create({
                data: {
                    ...fields,
                    dueDate: dueDate ? new Date(dueDate) : null,
                    projectId,
                    createdById: userId,
                    assigneeId: assigneeId ?? null,
                },
            });

            await tx.activity.create({
                data: {
                    taskId: created.id,
                    userId,
                    action: 'TASK_CREATED',
                    details: { title: created.title },
                },
            });

            if (assigneeId && assigneeId !== userId) {
                await tx.notification.create({
                    data: {
                        userId: assigneeId,
                        type: 'TASK_ASSIGNED',
                        message: `You were assigned task: ${created.title}`,
                    },
                });
            }

            return created;
        });

        return res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: { task },
        });
    } catch (error) {
        console.error('Create task error:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to create task',
        });
    }
}

// LIST TASKS WITH FILTERS AND PAGINATION
export async function getTasks(req: Request, res: Response) {
    const { userId, role } = res.locals.authUser;
    const projectId = req.params.projectId;

    if (typeof projectId !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'Invalid project ID',
        });
    }

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const status = req.query.status;
    const priority = req.query.priority;
    const assigneeId = req.query.assigneeId;
    const dueBefore = req.query.dueBefore;
    const dueAfter = req.query.dueAfter;

    if (
        !Number.isInteger(page) || page < 1 ||
        !Number.isInteger(limit) || limit < 1 || limit > 100
    ) {
        return res.status(400).json({
            success: false,
            message: 'Invalid pagination values',
        });
    }

    if (
        status !== undefined &&
        (typeof status !== 'string' ||
            !taskStatuses.includes(status as TaskStatus))
    ) {
        return res.status(400).json({
            success: false,
            message: 'Invalid task status',
        });
    }

    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

    if (
        priority !== undefined &&
        (typeof priority !== 'string' || !priorities.includes(priority))
    ) {
        return res.status(400).json({
            success: false,
            message: 'Invalid task priority',
        });
    }

    if (
        (assigneeId !== undefined && typeof assigneeId !== 'string') ||
        (dueBefore !== undefined && typeof dueBefore !== 'string') ||
        (dueAfter !== undefined && typeof dueAfter !== 'string')
    ) {
        return res.status(400).json({
            success: false,
            message: 'Invalid task filter',
        });
    }

    const before = dueBefore ? new Date(dueBefore) : undefined;
    const after = dueAfter ? new Date(dueAfter) : undefined;

    if (
        (before && Number.isNaN(before.getTime())) ||
        (after && Number.isNaN(after.getTime()))
    ) {
        return res.status(400).json({
            success: false,
            message: 'Invalid due date filter',
        });
    }

    try {
        const project = await getAccessibleProject(projectId, userId, role);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found or inaccessible',
            });
        }

        // Members can only filter tasks assigned to themselves.
        if (
            role === 'MEMBER' &&
            assigneeId &&
            assigneeId !== userId
        ) {
            return res.status(403).json({
                success: false,
                message: 'You cannot filter by another user',
            });
        }

        const where = {
            projectId,
            ...(status ? { status: status as TaskStatus } : {}),
            ...(priority
                ? { priority: priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' }
                : {}),
            ...(assigneeId ? { assigneeId } : {}),
            ...(before || after
                ? {
                    dueDate: {
                        ...(before ? { lte: before } : {}),
                        ...(after ? { gte: after } : {}),
                    },
                }
                : {}),
        };

        // Members see only their assigned tasks.
        if (role === 'MEMBER') {
            where.assigneeId = userId;
        }

        const [tasks, total] = await prisma.$transaction([
            prisma.task.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    assignee: {
                        select: { id: true, name: true, email: true },
                    },
                },
            }),
            prisma.task.count({ where }),
        ]);

        return res.json({
            success: true,
            data: {
                tasks,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error('Get tasks error:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch tasks',
        });
    }
}

// UPDATE TASK
export async function updateTask(req: Request, res: Response) {
    const { userId, role } = res.locals.authUser;
    const { taskId } = req.params;

    const parsed = updateTaskSchema.safeParse(req.body);

    if (!parsed.success || Object.keys(req.body ?? {}).length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Provide valid task fields to update',
            errors: parsed.success ? undefined : parsed.error.issues,
        });
    }

    try {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: {
                project: { select: { id: true, isArchived: true } },
            },
        });

        if (!task || task.project.isArchived) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        const manager = await isProjectManager(
            task.projectId,
            userId,
            role,
        );

        const accessible = await getAccessibleProject(
            task.projectId,
            userId,
            role,
        );

        if (!accessible) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        // Members may update only their own task's status.
        if (!manager) {
            if (
                role !== 'MEMBER' ||
                task.assigneeId !== userId ||
                Object.keys(parsed.data).some((key) => key !== 'status')
            ) {
                return res.status(403).json({
                    success: false,
                    message: 'You are not allowed to make these task changes',
                });
            }
        }

        const data = parsed.data;

        if (data.assigneeId) {
            if (!(await isMember(task.projectId, data.assigneeId))) {
                return res.status(400).json({
                    success: false,
                    message: 'Assignee must be a project member',
                });
            }
        }

        const updated = await prisma.$transaction(async (tx: any) => {
            const changes = {
                ...(data.title !== undefined ? { title: data.title } : {}),
                ...(data.description !== undefined
                    ? { description: data.description }
                    : {}),
                ...(data.priority !== undefined
                    ? { priority: data.priority }
                    : {}),
                ...(data.dueDate !== undefined
                    ? { dueDate: data.dueDate ? new Date(data.dueDate) : null }
                    : {}),
                ...(data.assigneeId !== undefined
                    ? {
                        assignee: data.assigneeId
                            ? { connect: { id: data.assigneeId } }
                            : { disconnect: true },
                    }
                    : {}),
                ...(data.status !== undefined ? { status: data.status } : {}),
            };

            const result = await tx.task.update({
                where: { id: taskId },
                data: changes,
            });

            if (data.status && data.status !== task.status) {
                await tx.activity.create({
                    data: {
                        taskId,
                        userId,
                        action: 'STATUS_CHANGED',
                        details: {
                            from: task.status,
                            to: data.status,
                        },
                    },
                });
            }

            if (
                data.assigneeId !== undefined &&
                data.assigneeId !== task.assigneeId
            ) {
                await tx.activity.create({
                    data: {
                        taskId,
                        userId,
                        action: 'ASSIGNEE_CHANGED',
                        details: {
                            from: task.assigneeId,
                            to: data.assigneeId,
                        },
                    },
                });

                if (data.assigneeId && data.assigneeId !== userId) {
                    await tx.notification.create({
                        data: {
                            userId: data.assigneeId,
                            type: 'TASK_ASSIGNED',
                            message: `You were assigned task: ${result.title}`,
                        },
                    });
                }
            }

            return result;
        });

        return res.json({
            success: true,
            message: 'Task updated successfully',
            data: { task: updated },
        });
    } catch (error) {
        console.error('Update task error:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to update task',
        });
    }
}

// DELETE TASK
export async function deleteTask(req: Request, res: Response) {
    const { userId, role } = res.locals.authUser;
    const { taskId } = req.params;

    try {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            select: {
                id: true,
                projectId: true,
                project: { select: { isArchived: true } },
            },
        });

        if (!task || task.project.isArchived) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        const manager = await isProjectManager(
            task.projectId,
            userId,
            role,
        );

        if (!manager) {
            return res.status(403).json({
                success: false,
                message: 'Only the project manager or admin can delete tasks',
            });
        }

        await prisma.task.delete({ where: { id: taskId } });

        return res.json({
            success: true,
            message: 'Task deleted successfully',
        });
    } catch (error) {
        console.error('Delete task error:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to delete task',
        });
    }
}