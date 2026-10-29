
import { PrismaClient, Role, ProjectPriority, TaskPriority, TaskStatus, } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting database seed...");

    const password = await bcrypt.hash("Demo@123", 10);

    const userData = [
        {
            id: "admin",
            name: "Admin User",
            email: "admin@gmail.com",
            role: Role.ADMIN,
        },
        {
            id: "member1",
            name: "Rabi",
            email: "rabi@gmail.com",
            role: Role.MEMBER,
        },
        {
            id: "member2",
            name: "Vishwa",
            email: "vishwa@gmail.com",
            role: Role.MEMBER,
        },
        {
            id: "member3",
            name: "Anu",
            email: "anu@gmail.com",
            role: Role.MEMBER,
        },
    ];

    const users: Record<string, { id: string; name: string; email: string; role: Role }> = {};

    for (const user of userData) {
        const savedUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {
                name: user.name,
                role: user.role,
                password,
            },
            create: {
                ...user,
                password,
            },
        });

        users[user.id] = savedUser;
    }

    const admin = users.admin!;
    const rabi = users.member1!;
    const vishwa = users.member2!;
    const anu = users.member3!;

    const projectData = [
        {
            id: "seed-project1",
            name: "Website Redesign",
            description:
                "Redesign the company website with a modern, responsive UI.",
            priority: ProjectPriority.HIGH,
            ownerId: admin.id,
        },
        {
            id: "seed-project2",
            name: "Task Management App",
            description:
                "Build a project and task tracking application.",
            priority: ProjectPriority.URGENT,
            ownerId: admin.id,
        },
        {
            id: "seed-project3",
            name: "Mobile App UI",
            description:
                "Create and implement mobile application screens.",
            priority: ProjectPriority.MEDIUM,
            ownerId: admin.id,
        },
    ];

    const projects: Record<string, { id: string }> = {};

    for (const project of projectData) {
        const savedProject = await prisma.project.upsert({
            where: { id: project.id },
            update: {
                name: project.name,
                description: project.description,
                priority: project.priority,
                ownerId: admin.id,
                isArchived: false,
            },
            create: project,
        });

        projects[project.id] = savedProject;
    }

    const project1 = projects["seed-project1"]!;
    const project2 = projects["seed-project2"]!;
    const project3 = projects["seed-project3"]!;

    const memberships = [
        { projectId: project1.id, userId: admin.id },
        { projectId: project1.id, userId: rabi.id },
        { projectId: project1.id, userId: vishwa.id },
        { projectId: project1.id, userId: anu.id },

        { projectId: project2.id, userId: admin.id },
        { projectId: project2.id, userId: rabi.id },
        { projectId: project2.id, userId: vishwa.id },
        { projectId: project2.id, userId: anu.id },

        { projectId: project3.id, userId: admin.id },
        { projectId: project3.id, userId: rabi.id },
        { projectId: project3.id, userId: vishwa.id },
        { projectId: project3.id, userId: anu.id },
    ];

    for (const membership of memberships) {
        await prisma.projectMember.upsert({
            where: {
                projectId_userId: {
                    projectId: membership.projectId,
                    userId: membership.userId,
                },
            },
            update: {},
            create: membership,
        });
    }
    const taskData = [
        {
            id: "seed-task1",
            title: "Create homepage wireframe",
            description: "Prepare the initial homepage wireframe.",
            status: TaskStatus.COMPLETED,
            priority: TaskPriority.HIGH,
            projectId: project1.id,
            createdById: admin.id,
            assigneeId: rabi.id,
        },
        {
            id: "seed-task2",
            title: "Develop responsive navbar",
            description: "Implement a responsive navigation bar.",
            status: TaskStatus.IN_PROGRESS,
            priority: TaskPriority.HIGH,
            projectId: project1.id,
            createdById: admin.id,
            assigneeId: vishwa.id,
        },
        {
            id: "seed-task3",
            title: "Build login API",
            description: "Implement and test login API integration.",
            status: TaskStatus.IN_REVIEW,
            priority: TaskPriority.URGENT,
            projectId: project2.id,
            createdById: admin.id,
            assigneeId: vishwa.id,
        },
        {
            id: "seed-task4",
            title: "Design dashboard",
            description: "Create dashboard UI designs.",
            status: TaskStatus.TODO,
            priority: TaskPriority.MEDIUM,
            projectId: project3.id,
            createdById: admin.id,
            assigneeId: anu.id,
        },
        {
            id: "seed-task5",
            title: "Test project permissions",
            description: "Verify role-based access for project members.",
            status: TaskStatus.TODO,
            priority: TaskPriority.HIGH,
            projectId: project2.id,
            createdById: admin.id,
            assigneeId: rabi.id,
        },
    ];

    const tasks: Record<string, { id: string }> = {};

    for (const task of taskData) {
        const savedTask = await prisma.task.upsert({
            where: { id: task.id },
            update: {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                projectId: task.projectId,
                createdById: task.createdById,
                assigneeId: task.assigneeId,
            },
            create: task,
        });

        tasks[task.id] = savedTask;
    }

    const task1 = tasks["seed-task1"]!;
    const task2 = tasks["seed-task2"]!;
    const task3 = tasks["seed-task3"]!;
    const task4 = tasks["seed-task4"]!;

    const comments = [
        {
            id: "seed-comment1",
            content: "The wireframe looks good. Ready for implementation.",
            taskId: task1.id,
            userId: rabi.id,
        },
        {
            id: "seed-comment2",
            content: "Login API is ready for review.",
            taskId: task3.id,
            userId: vishwa.id,
        },
    ];

    for (const comment of comments) {
        await prisma.comment.upsert({
            where: { id: comment.id },
            update: {
                content: comment.content,
                taskId: comment.taskId,
                userId: comment.userId,
            },
            create: comment,
        });
    }

    const activities = [
        {
            id: "seed-activity1",
            action: "TASK_CREATED",
            details: {
                message: "Created the homepage wireframe task",
            },
            taskId: task1.id,
            userId: admin.id,
        },
        {
            id: "seed-activity2",
            action: "TASK_STATUS_UPDATED",
            details: {
                message: "Moved the login API task to review",
            },
            taskId: task3.id,
            userId: admin.id,
        },
    ];

    for (const activity of activities) {
        await prisma.activity.upsert({
            where: { id: activity.id },
            update: {
                action: activity.action,
                details: activity.details,
                taskId: activity.taskId,
                userId: activity.userId,
            },
            create: activity,
        });
    }

    const notifications = [
        {
            id: "seed-notification1",
            message: "You have been assigned a task: Develop responsive navbar",
            type: "TASK_ASSIGNED",
            userId: vishwa.id,
        },
        {
            id: "seed-notification2",
            message: "You have been assigned a task: Design dashboard",
            type: "TASK_ASSIGNED",
            userId: anu.id,
        },
        {
            id: "seed-notification3",
            message: "Your login API task is ready for review",
            type: "TASK_UPDATED",
            userId: vishwa.id,
        },
    ];

    for (const notification of notifications) {
        await prisma.notification.upsert({
            where: { id: notification.id },
            update: {
                message: notification.message,
                type: notification.type,
                userId: notification.userId,
            },
            create: notification,
        });
    }
}

main()
    .catch((error) => {
        console.error("Seed failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
