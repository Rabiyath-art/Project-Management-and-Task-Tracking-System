import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthUser {
    userId: string;
    role: 'ADMIN' | 'MEMBER';
}

export function authenticateToken(
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    const authorization = res.req.headers.authorization;
    const token = authorization?.startsWith('Bearer ')
        ? authorization.slice(7)
        : null;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Authentication token is required',
        });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret || secret.length < 32) {
        return res.status(500).json({
            success: false,
            message: 'Authentication configuration error',
        });
    }

    try {
        const payload = jwt.verify(token, secret);

        if (
            typeof payload === 'string' ||
            typeof payload.userId !== 'string' ||
            !['ADMIN', 'MEMBER'].includes(
                String(payload.role),
            )
        ) {
            return res.status(401).json({
                success: false,
                message: 'Invalid authentication token',
            });
        }

        res.locals.authUser = {
            userId: payload.userId,
            role: payload.role,
        } satisfies AuthUser;

        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired authentication token',
        });
    }
}