
export type ProjectStatus =
    | "PLANNING"
    | "IN_PROGRESS"
    | "ON_HOLD"
    | "COMPLETED";

export type ProjectPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface ProjectMember {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "PROJECT_MANAGER" | "MEMBER";
    avatarColor?: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    startDate: string;
    deadline: string;
    progress: number;
    members: ProjectMember[];
    taskCount: number;
    completedTaskCount: number;
    archived: boolean;
    createdAt: string;
}

export type ProjectFormValues = Pick<
    Project,
    "name" | "description" | "status" | "priority" | "startDate" | "deadline"
> & {
    memberIds: string[];
};
