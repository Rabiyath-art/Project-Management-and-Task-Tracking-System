import type { Request, Response } from 'express';
import prisma from '../../config/prisma.js';

export async function getDashboard(_req: Request, res: Response,) {
    const { userId, role } = res.locals.authUser;

    try {
        const projects = await prisma.project.findMany({
            where: {
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
            select: {
                id: true,
                name: true,
                priority: true,
                deadline: true,
            },
        });

        const projectIds = projects.map((project: { id: any; }) => project.id);
        const taskWhere = { projectId: { in: projectIds }, ...(role === 'MEMBER' ? { assigneeId: userId } : {}), };
        const now = new Date();

        const [totalTasks, completedTasks, overdueTasks, projectTaskGroups, recentActivity] = await Promise.all([
            prisma.task.count({ where: taskWhere }),
            prisma.task.count({ where: { ...taskWhere, status: 'COMPLETED' }, }),

            prisma.task.count({
                where: { ...taskWhere, status: { not: 'COMPLETED' }, dueDate: { lt: now }, },
            }),

            prisma.task.groupBy({
                by: ['projectId', 'status'],
                where: taskWhere,
                _count: { _all: true },
            }),

            prisma.activity.findMany({
                where: {
                    task: {
                        projectId: { in: projectIds },
                        ...(role === 'MEMBER' ? { assigneeId: userId } : {}),
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: 10,
                include: {
                    user: { select: { id: true, name: true } },
                    task: {
                        select: {
                            id: true,
                            title: true,
                            projectId: true,
                        },
                    },
                },
            }),
        ]);

        const projectStatistics = projects.map((project: { id: any; name: any; priority: any; deadline: any; }) => {
            const groups = projectTaskGroups.filter((group: { projectId: any; }) => group.projectId === project.id,);

            const total = groups.reduce((sum: any, group: { _count: { _all: any; }; }) => sum + group._count._all, 0,);

            const completed = groups.filter((group: { status: string; }) => group.status === 'COMPLETED').reduce((sum: any, group: { _count: { _all: any; }; }) => sum + group._count._all, 0);

            return {
                id: project.id,
                name: project.name,
                priority: project.priority,
                deadline: project.deadline,
                totalTasks: total,
                completedTasks: completed,
                completionPercentage: total === 0 ? 0 : Math.round((completed / total) * 100),
            };
        });

        return res.json({
            success: true,
            data: {
                totalProjects: projects.length,
                totalTasks,
                completedTasks,
                overdueTasks,
                completionPercentage: totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
                projects: projectStatistics,
                recentActivity,
            },
        });
    } catch (error) {
        console.error('Dashboard error:', error);

        return res.status(500).json({
            success: false,
            message: 'Unable to fetch dashboard statistics',
        });
    }
}