import api from "@/services/api";
import type { ProjectMember } from "@/types/project.types";
import type { TeamRole } from "@/types/team.types";

export interface ApiUser {
    id: string;
    name: string;
    email: string;
    role: TeamRole;
    createdAt: string;
    projectsCount: number;
}

interface UsersResponse {
    success: boolean;
    data: {
        users: ApiUser[];
    };
}

interface CreateUserResponse {
    success: boolean;
    message: string;
    data: {
        user: ApiUser;
        credentials: {
            email: string;
            temporaryPassword: string;
        };
    };
}

export interface CreateUserInput {
    name: string;
    email: string;
    role: TeamRole;
}

export const userService = {
    async getAll(): Promise<ProjectMember[]> {
        const response = await api.get<UsersResponse>("/users");
        return response.data.data.users;
    },

    async create(values: CreateUserInput) {
        const response = await api.post<CreateUserResponse>("/users", {
            name: values.name.trim(),
            email: values.email.trim().toLowerCase(),
            role: values.role,
        });

        return response.data.data;
    },
};