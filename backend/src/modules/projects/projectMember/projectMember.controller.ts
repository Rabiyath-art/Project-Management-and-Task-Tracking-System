import type { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../../../config/prisma.js';

const memberSchema = z.object({
    userId: z.string().min(1),
});

async function canManageMembership(
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

// LIST MEMBERS
export async function getProjectMembers(
    req: Request,
    res: Response,
) {
    const { userId, role } = res.locals.authUser;
    const { projectId } = req.params;

    if (typeof projectId !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'A valid projectId is required',
        });
    }

    try {
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                ...(role === 'ADMIN'
                    ? {}
                    : {
                        OR: [
                            { ownerId: userId },
                            { members: { some: { userId } } },
                        ],
                    }),
            },
            select: { id: true },
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        const members = await prisma.projectMember.findMany({
            where: { projectId },
            orderBy: { joinedAt: 'asc' },
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
        });

        return res.json({
            success: true,
            data: { members },
        });
    } catch (error) {
        console.error('List members error:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch project members',
        });
    }
}

// ADD MEMBER
export async function addProjectMember(
    req: Request,
    res: Response,
) {
    const { userId, role } = res.locals.authUser;
    const { projectId } = req.params;

    if (typeof projectId !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'A valid projectId is required',
        });
    }

    const parsed = memberSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: 'A valid userId is required',
        });
    }

    const { userId: newUserId } = parsed.data;

    try {
        const allowed = await canManageMembership(
            projectId,
            userId,
            role,
        );

        if (!allowed) {
            return res.status(404).json({
                success: false,
                message: 'Project not found or you cannot manage it',
            });
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: { id: true, isArchived: true },
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        if (project.isArchived) {
            return res.status(409).json({
                success: false,
                message: 'Cannot add members to an archived project',
            });
        }

        const targetUser = await prisma.user.findUnique({
            where: { id: newUserId },
            select: { id: true, name: true, email: true, role: true },
        });

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const existingMember = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId: newUserId,
                },
            },
        });

        if (existingMember) {
            return res.status(409).json({
                success: false,
                message: 'User is already a project member',
            });
        }

        const membership = await prisma.projectMember.create({
            data: {
                projectId,
                userId: newUserId,
            },
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
        });

        return res.status(201).json({
            success: true,
            message: 'Project member added successfully',
            data: { membership },
        });
    } catch (error) {
        console.error('Add member error:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to add project member',
        });
    }
}

// REMOVE MEMBER
export async function removeProjectMember(
    req: Request,
    res: Response,
) {
    const { userId, role } = res.locals.authUser;
    const { projectId, userId: memberId } = req.params;

    if (typeof projectId !== 'string' || typeof memberId !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'Valid projectId and userId are required',
        });
    }

    try {
        const allowed = await canManageMembership(
            projectId,
            userId,
            role,
        );

        if (!allowed) {
            return res.status(404).json({
                success: false,
                message: 'Project not found or you cannot manage it',
            });
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: { id: true, ownerId: true, isArchived: true },
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        if (project.isArchived) {
            return res.status(409).json({
                success: false,
                message: 'Cannot modify members of an archived project',
            });
        }

        if (project.ownerId === memberId) {
            return res.status(409).json({
                success: false,
                message: 'The project owner cannot be removed',
            });
        }

        const membership = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId: memberId,
                },
            },
        });

        if (!membership) {
            return res.status(404).json({
                success: false,
                message: 'Project membership not found',
            });
        }

        await prisma.projectMember.delete({
            where: {
                projectId_userId: {
                    projectId,
                    userId: memberId,
                },
            },
        });

        return res.json({
            success: true,
            message: 'Project member removed successfully',
        });
    } catch (error) {
        console.error('Remove member error:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to remove project member',
        });
    }
}