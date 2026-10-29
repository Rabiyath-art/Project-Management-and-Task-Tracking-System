import api from "@/services/api";
import type { ProjectMember } from "@/types/project.types";

interface UsersResponse {
    success: boolean;
    data: {
        users: ProjectMember[];
    };
}

export const userService = {
    async getAll(): Promise<ProjectMember[]> {
        const response = await api.get<UsersResponse>("/users");
        return response.data.data.users;
    },
};