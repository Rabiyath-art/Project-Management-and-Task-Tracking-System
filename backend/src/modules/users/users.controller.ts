import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUsers(_req: Request, res: Response) {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
            orderBy: { name: "asc" },
        });

        return res.status(200).json({
            success: true,
            data: { users },
        });
    } catch (error) {
        console.error("Get users failed:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch users.",
        });
    }
}
