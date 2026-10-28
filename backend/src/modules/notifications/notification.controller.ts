import type { Request, Response } from 'express';
import prisma from '../../config/prisma.js';

export async function getNotifications(
    _req: Request,
    res: Response,
) {
    const { userId } = res.locals.authUser;

    try {
        const page = Number(_req.query.page ?? 1);
        const limit = Number(_req.query.limit ?? 10);

        if (
            !Number.isInteger(page) ||
            page < 1 ||
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pagination values',
            });
        }

        const where = { userId };

        const [notifications, total, unreadCount] =
            await prisma.$transaction([
                prisma.notification.findMany({
                    where,
                    orderBy: { createdAt: 'desc' },
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                prisma.notification.count({ where }),
                prisma.notification.count({
                    where: { userId, isRead: false },
                }),
            ]);

        return res.json({
            success: true,
            data: {
                notifications,
                unreadCount,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error('Get notifications error:', error);

        return res.status(500).json({
            success: false,
            message: 'Unable to fetch notifications',
        });
    }
}

export async function markNotificationRead(
    req: Request,
    res: Response,
) {
    const { userId } = res.locals.authUser;
    const { notificationId } = req.params;

    try {
        const result = await prisma.notification.updateMany({
            where: {
                id: notificationId,
                userId,
            },
            data: { isRead: true },
        });

        if (result.count === 0) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found',
            });
        }

        return res.json({
            success: true,
            message: 'Notification marked as read',
        });
    } catch (error) {
        console.error('Mark notification error:', error);

        return res.status(500).json({
            success: false,
            message: 'Unable to update notification',
        });
    }
}