
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "../../config/prisma.js";
import { createUserSchema } from "../../models/userSchema.js";

// export async function getUsers(_req: Request, res: Response) {
//     try {
//         const users = await prisma.user.findMany({
//             select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 role: true,
//             },
//             orderBy: { name: "asc" },
//         });

//         return res.status(200).json({
//             success: true,
//             data: { users },
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Unable to fetch users.",
//         });
//     }
// }

export async function getUsers(_req: Request, res: Response) {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,

                projectsOwned: {
                    select: {
                        id: true,
                    },
                },

                memberships: {
                    select: {
                        projectId: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });

        const formattedUsers = users.map((user) => {
            // Owner + assigned member projects.
            // Set prevents counting the same project twice.
            const projectIds = new Set([
                ...user.projectsOwned.map((project) => project.id),
                ...user.memberships.map((membership) => membership.projectId),
            ]);

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                projectsCount: projectIds.size,
            };
        });

        return res.status(200).json({
            success: true,
            data: {
                users: formattedUsers,
            },
        });
    } catch (error) {
        console.error("Get users error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch users.",
        });
    }
}

export async function createUser(req: Request, res: Response) {
    try {
        const authUser = res.locals.authUser;
        if (authUser?.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Only admins can create users.",
            });
        }

        const parsed = createUserSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid user details.",
                errors: parsed.error.issues,
            });
        }

        const { name, email, role } = parsed.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "A user with this email already exists.",
            });
        }

        const temporaryPassword = "Demo@123";
        const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

        const user = await prisma.user.create({
            data: {
                name, email, password: hashedPassword, role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully.",
            data: {
                user,
                credentials: {
                    email: user.email,
                    temporaryPassword,
                },
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create user.",
        });
    }
}
