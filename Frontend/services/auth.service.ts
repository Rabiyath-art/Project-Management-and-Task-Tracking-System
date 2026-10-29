
import api from "./api";
import type { AuthResponse, AuthResult, LoginRequest, MeResponse, RegisterRequest } from "@/types/auth.types";

export const authService = {
    async login(data: LoginRequest): Promise<AuthResult> {
        const response = await api.post<AuthResponse>("/auth/login", data);

        return {
            success: response.data.success,
            message: response.data.message,
            user: response.data.data.user,
            token: response.data.data.token,
        };
    },

    async register(data: RegisterRequest): Promise<AuthResult> {
        const response = await api.post<AuthResponse>("/auth/register", data);

        return {
            success: response.data.success,
            message: response.data.message,
            user: response.data.data.user,
            token: response.data.data.token,
        };
    },

    async getCurrentUser(): Promise<MeResponse> {
        const response = await api.get<MeResponse>("/auth/me");
        return response.data;
    },

    logout(): void {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
    },
};
