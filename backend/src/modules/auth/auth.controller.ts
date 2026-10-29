import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma.js';
import { registerSchema, loginSchema } from '../../models/auth.schema.js';

function createToken(userId: string, role: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error('JWT_SECRET must contain at least 32 characters');
    }

    return jwt.sign({ userId, role }, secret, {
        expiresIn: '1d',
    });
}

export async function register(req: Request, res: Response) {
    try {
        const response = registerSchema.safeParse(req.body);

        if (!response.success) {
            return res.status(400).json({
                success: false,
                message: 'Invalid registration details',
                errors: response.error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                })),
            });
        }

        const { name, email, password } = response.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email is already registered',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'MEMBER',
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        const token = createToken(user.id, user.role);

        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: { user, token },
        });
    } catch (error) {
        console.error('Registration error:', error);

        return res.status(500).json({
            success: false,
            message: 'Unable to register user',
        });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const parsed = loginSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password format',
            });
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password,
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        const token = createToken(user.id, user.role);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        console.error('Login error:', error);

        return res.status(500).json({
            success: false,
            message: 'Unable to log in',
        });
    }
}