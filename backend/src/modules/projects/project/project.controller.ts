import type { Request, Response } from 'express';
import prisma from '../../../config/prisma.js';
import { projectSchema } from '../../../models/project.schema.js';

const updateProjectSchema = projectSchema.partial();

function canManageProjects(role: string) {
    return role === 'ADMIN' || role === 'PROJECT_MANAGER';
}

async function canAccessProject(projectId: string, userId: string, role: string,) {
    if (role === 'ADMIN') return true;

    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            OR: [
                { ownerId: userId },
                { members: { some: { userId } } },
            ],
        },
        select: { id: true },
    });

    return Boolean(project);
}

async function canManageProject(projectId: any, userId: string, role: string,) {
    if (role === 'ADMIN') return true;
    if (role !== 'PROJECT_MANAGER') return false;

    const project = await prisma.project.findFirst({
        where: { id: projectId, ownerId: userId },
        select: { id: true },
    });

    return Boolean(project);
}

// CREATE PROJECT
export async function createProject(req: Request, res: Response) {
    const { userId, role } = res.locals.authUser;

    if (!canManageProjects(role)) {
        return res.status(403).json({
            success: false,
            message: 'Only Admins and Project Managers can create projects',
        });
    }

    const parsed = projectSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: 'Invalid project details',
            errors: parsed.error.issues,
        });
    }

    try {
        const { name, description, deadline, priority } = parsed.data;

        const project = await prisma.project.create({
            data: {
                name,
                description,
                deadline: deadline ? new Date(deadline) : null,
                priority,
                ownerId: userId,
                members: {
                    create: { userId },
                },
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });

        return res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: { project },
        });
    } catch (error) {
        console.error('Create project error:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to create project',
        });
    }
}

// LIST AUTHORIZED PROJECTS
export async function getProjects(_req: Request, res: Response) {
    const { userId, role } = res.locals.authUser;

    try {
        const projects = await prisma.project.findMany({
            where: role === 'ADMIN'
                ? {}
                : {
                    OR: [
                        { ownerId: userId },
                        { members: { some: { userId } } },
                    ],
                },
            orderBy: { createdAt: 'desc' },

            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        members: true,
                        tasks: true,
                    },
                },
            },
        });

        return res.json({
            success: true,
            data: { projects },
        });
    } catch (error) {
        console.error('Get projects error:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch projects',
        });
    }
}

// GET ONE PROJECT
export async function getProject(req: Request, res: Response) {
    const { userId, role } = res.locals.authUser;
    const projectId = req.params.projectId;

    if (typeof projectId !== 'string') {
        return res.status(404).json({
            success: false,
            message: 'Project not found',
        });
    }

    try {
        const allowed = await canAccessProject(projectId, userId, role);

        if (!allowed) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true, role: true },
                        },
                    },
                },
                _count: { select: { tasks: true, members: true } },
            },
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        return res.json({ success: true, data: { project } });
    } catch (error) {
        console.error('Get project error:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch project',
        });
    }
}

// UPDATE PROJECT
export async function updateProject(req: Request, res: Response) {
    const { userId, role } = res.locals.authUser;
    const { projectId } = req.params;

    if (typeof projectId !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'Invalid project ID',
        });
    }

    if (!(await canManageProject(projectId, userId, role))) {
        return res.status(404).json({
            success: false,
            message: 'Project not found or you cannot manage it',
        });
    }

    const parsed = updateProjectSchema.safeParse(req.body);

    if (!parsed.success || Object.keys(req.body ?? {}).length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Provide valid project fields to update',
        });
    }

    try {
        const data = parsed.data;

        const project = await prisma.project.update({
            where: { id: projectId },
            data: {
                ...data,
                ...(data.deadline !== undefined
                    ? { deadline: data.deadline ? new Date(data.deadline) : null }
                    : {}),
            },
        });

        return res.json({
            success: true,
            message: 'Project updated successfully',
            data: { project },
        });
    } catch (error) {
        console.error('Update project error:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to update project',
        });
    }
}

// ARCHIVE PROJECT
export async function archiveProject(req: Request, res: Response) {
    const { userId, role } = res.locals.authUser;
    const { projectId } = req.params;

    if (typeof projectId !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'Invalid project ID',
        });
    }

    try {
        if (!(await canManageProject(projectId, userId, role))) {
            return res.status(404).json({
                success: false,
                message: 'Project not found or you cannot manage it',
            });
        }

        const project = await prisma.project.update({
            where: { id: projectId },
            data: { isArchived: true },
        });

        return res.json({
            success: true,
            message: 'Project archived successfully',
            data: { project },
        });
    } catch (error) {
        console.error('Archive project error:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to archive project',
        });
    }
}

export async function deleteProject(req: Request, res: Response) {
    try {
        const projectId = req.params.projectId;

        if (typeof projectId !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID',
            });
        }

        const { userId, role } = res.locals.authUser;

        if (!userId || !role) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        const canDelete =
            role === 'ADMIN' ||
            (role === 'PROJECT_MANAGER' &&
                project.ownerId === userId);

        if (!canDelete) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this project',
            });
        }

        // await prisma.$transaction([
        //     prisma.notification.deleteMany({
        //         where: { projectId },
        //     }),
        //     prisma.activity.deleteMany({
        //         where: { projectId },
        //     }),
        //     prisma.comment.deleteMany({
        //         where: { task: { projectId } },
        //     }),
        //     prisma.task.deleteMany({
        //         where: { projectId },
        //     }),
        //     prisma.projectMember.deleteMany({
        //         where: { projectId },
        //     }),
        //     prisma.project.delete({
        //         where: { id: projectId },
        //     }),
        // ]);

        return res.status(200).json({
            success: true,
            message: 'Project deleted successfully',
        });
    } catch (error) {
        console.error('Delete project failed:', error);

        return res.status(500).json({
            success: false,
            message: 'Unable to delete project',
        });
    }
}