
import type { Task } from "@/types/task.types";

export const initialTasks: Task[] = [
    {
        id: "TSK-101",
        title: "Design the dashboard UI",
        description: "Create a clean and responsive dashboard layout.",
        project: "Project Management System",
        assignee: "Rabiyath Beevi",
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: "2026-11-02",
        projectId: "",
        assigneeId: null
    },
    {
        id: "TSK-102",
        title: "Implement user authentication",
        description: "Connect the login and registration APIs.",
        project: "Project Management System",
        assignee: "Arun Kumar",
        status: "IN_REVIEW",
        priority: "URGENT",
        dueDate: "2026-10-30",
        projectId: "",
        assigneeId: null
    },
    {
        id: "TSK-103",
        title: "Create project listing API",
        description: "Implement project retrieval and pagination.",
        project: "Project Management System",
        assignee: "Priya S",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: "2026-11-05",
        projectId: "",
        assigneeId: null
    },
    {
        id: "TSK-104",
        title: "Fix responsive navigation",
        description: "Improve the sidebar experience on mobile.",
        project: "Website Redesign",
        assignee: "Rabiyath Beevi",
        status: "COMPLETED",
        priority: "LOW",
        dueDate: "2026-10-24",
        projectId: "",
        assigneeId: null
    },
    {
        id: "TSK-105",
        title: "Build task management API",
        description: "Add task creation, update, and delete endpoints.",
        project: "Project Management System",
        assignee: "Arun Kumar",
        status: "TODO",
        priority: "HIGH",
        dueDate: "2026-11-03",
        projectId: "",
        assigneeId: null
    },
    {
        id: "TSK-106",
        title: "Review database schema",
        description: "Validate task relations and database indexes.",
        project: "Backend Development",
        assignee: "Priya S",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        dueDate: "2026-11-01",
        projectId: "",
        assigneeId: null
    },
];
