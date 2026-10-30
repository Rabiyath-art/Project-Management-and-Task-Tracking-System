
import api from "@/services/api";
import type {
    CreateProjectRequest, Project, ProjectApiResponse, ProjectListApiResponse, UpdateProjectRequest,
} from "@/types/project.types";

function mapProject(raw: Record<string, any>): Project {
    const apiMembers = Array.isArray(raw.members) ? raw.members : [];

    const members = apiMembers.map((item: any) => {
        const user = item.user ?? item;

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            projectsCount: user.projectsCount ?? 0,
            createdAt: user.createdAt ?? "",
        };
    });

    return {
        id: raw.id,
        name: raw.name,
        description: raw.description ?? "",
        status: raw.status ?? "PLANNING",
        priority: raw.priority ?? "MEDIUM",
        startDate: raw.startDate ?? raw.createdAt ?? "",
        deadline: raw.deadline ?? "",
        progress: raw.progress ?? 0,
        members,
        taskCount: raw._count?.tasks ?? raw.taskCount ?? 0,
        completedTaskCount: raw.completedTaskCount ?? 0,
        archived: raw.isArchived ?? raw.archived ?? false,
        createdAt: raw.createdAt ?? "",
    };
}

export const projectService = {

    async getAll(): Promise<Project[]> {
        const response = await api.get<ProjectListApiResponse>("/projects");
        const projects = response.data.data.projects.map(mapProject);
        return projects.filter(project => !project.archived);
    },

    async getById(id: string): Promise<Project> {
        const response = await api.get<ProjectApiResponse>(
            `/projects/${encodeURIComponent(id)}`,
        );

        return mapProject(response.data.data.project);
    },

    async create(data: CreateProjectRequest): Promise<Project> {
        const response = await api.post<ProjectApiResponse>("/projects", data);
        return mapProject(response.data.data.project);
    },

    async update(
        id: string,
        data: UpdateProjectRequest,
    ): Promise<Project> {
        const response = await api.patch<ProjectApiResponse>(
            `/projects/${encodeURIComponent(id)}`,
            data,
        );

        return mapProject(response.data.data.project);
    },

    async archive(id: string): Promise<void> {
        await api.patch(`/projects/${encodeURIComponent(id)}/archive`);
    },

    async addMember(projectId: string, userId: string): Promise<void> {
        await api.post(
            `/projects/${encodeURIComponent(projectId)}/members`,
            { userId },
        );
    },

    async removeMember(projectId: string, userId: string): Promise<void> {
        await api.delete(
            `/projects/${encodeURIComponent(projectId)}/members/${encodeURIComponent(userId)}`,
        );
    },

    async delete(projectId: string): Promise<void> {
        await api.delete(`/projects/${projectId}`);
    }
};
