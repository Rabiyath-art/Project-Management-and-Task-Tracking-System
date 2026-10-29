
import api from "@/services/api";
import type { TaskPriority, TaskStatus } from "@/types/task.types";

export interface ApiTask {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string | null;
    projectId: string;
    assigneeId: string | null;
    assignee?: {
        id: string;
        name: string;
        email: string;
    } | null;
}

interface TaskListResponse {
    success: boolean;
    data: {
        tasks: ApiTask[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

interface TaskResponse {
    success: boolean;
    message: string;
    data: { task: ApiTask };
}

export interface TaskPayload {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string | null;
    assigneeId: string | null;
}

export const taskService = {
    async getByProject(projectId: string): Promise<ApiTask[]> {
        const response = await api.get<TaskListResponse>(
            `/projects/${projectId}/tasks`,
            { params: { page: 1, limit: 100 } }
        );

        return response.data.data.tasks;
    },

    async create(projectId: string, payload: TaskPayload): Promise<ApiTask> {
        const response = await api.post<TaskResponse>(
            `/projects/${projectId}/tasks`,
            payload
        );

        return response.data.data.task;
    },

    async update(taskId: string, payload: Partial<TaskPayload> & {
        status?: TaskStatus;
    }): Promise<ApiTask> {
        const response = await api.patch<TaskResponse>(
            `/tasks/${taskId}`,
            payload
        );

        return response.data.data.task;
    },

    async delete(taskId: string): Promise<void> {
        await api.delete(`/tasks/${taskId}`);
    },
};
