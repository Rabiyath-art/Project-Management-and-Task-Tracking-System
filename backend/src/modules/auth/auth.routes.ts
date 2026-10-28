import { Router } from 'express';
import { register, login } from './auth.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';
import prisma from '../../config/prisma.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', authenticateToken, async (_req, res) => {
    const { userId } = res.locals.authUser;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'User account no longer exists',
        });
    }

    return res.json({
        success: true,
        data: { user },
    });
});

export default router;