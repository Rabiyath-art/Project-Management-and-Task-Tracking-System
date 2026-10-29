
export type TaskStatus =
    | "TODO"
    | "IN_PROGRESS"
    | "IN_REVIEW"
    | "COMPLETED";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TaskView = "table" | "grid" | "kanban";


export interface Task {
    id: string;
    title: string;
    description: string;
    project: string;
    projectId: string;
    assignee: string;
    assigneeId: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
}

export interface TaskFormValues {
    title: string;
    description: string;
    project: string;
    projectId: string;
    assignee: string;
    assigneeId: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
}

export const TASK_STATUSES: {
    value: TaskStatus;
    label: string;
}[] = [
        { value: "TODO", label: "To Do" },
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "IN_REVIEW", label: "In Review" },
        { value: "COMPLETED", label: "Completed" },
    ];

export const TASK_PRIORITIES: {
    value: TaskPriority;
    label: string;
}[] = [
        { value: "LOW", label: "Low" },
        { value: "MEDIUM", label: "Medium" },
        { value: "HIGH", label: "High" },
        { value: "URGENT", label: "Urgent" },
    ];

export const EMPTY_TASK_FORM: TaskFormValues = {
    title: "",
    description: "",
    project: "Project Management System",
    assignee: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
    projectId: "",
    assigneeId: null
};

// For comment

export interface TaskComment {
    id: string;
    taskId: string;
    author: string;
    message: string;
    createdAt: string;
}

export type TaskActivityType =
    | "CREATED"
    | "UPDATED"
    | "STATUS_CHANGED"
    | "PRIORITY_CHANGED"
    | "ASSIGNEE_CHANGED"
    | "COMMENT_ADDED";

export interface TaskActivity {
    id: string;
    taskId: string;
    type: TaskActivityType;
    description: string;
    actor: string;
    createdAt: string;
}
