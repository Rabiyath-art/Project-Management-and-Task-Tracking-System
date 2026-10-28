
// import api from "@/services/api";
// import type {
//     CreateProjectRequest,
//     Project,
//     ProjectListResponse,
//     ProjectResponse,
//     UpdateProjectRequest,
// } from "@/types/project.types";

// export const projectService = {
//     async getAll(params?: {
//         search?: string;
//         status?: string;
//         priority?: string;
//         page?: number;
//         limit?: number;
//     }): Promise<ProjectListResponse> {
//         const response = await api.get<ProjectListResponse>("/projects", {
//             params,
//         });

//         return response.data;
//     },

//     async getById(id: string): Promise<Project> {
//         const response = await api.get<ProjectResponse>(
//             `/projects/${encodeURIComponent(id)}`
//         );

//         return response.data.project;
//     },

//     async create(data: CreateProjectRequest): Promise<Project> {
//         const response = await api.post<ProjectResponse>("/projects", data);

//         return response.data.project;
//     },

//     async update(
//         id: string,
//         data: UpdateProjectRequest
//     ): Promise<Project> {
//         const response = await api.put<ProjectResponse>(
//             `/projects/${encodeURIComponent(id)}`,
//             data
//         );

//         return response.data.project;
//     },

//     async archive(id: string): Promise<void> {
//         await api.patch(
//             `/projects/${encodeURIComponent(id)}/archive`
//         );
//     },

//     async addMember(projectId: string, userId: string): Promise<void> {
//         await api.post(`/projects/${encodeURIComponent(projectId)}/members`, { userId }
//         );
//     },

//     async removeMember(projectId: string, userId: string): Promise<void> {
//         await api.delete(`/projects/${encodeURIComponent(projectId)}/members/${encodeURIComponent(userId)}`
//         );
//     },
// };
