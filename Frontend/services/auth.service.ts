
import api from "./api";
import type {
    AuthResponse,
    LoginRequest,
    MeResponse,
    RegisterRequest,
} from "@/types/auth.types";

export const authService = {
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>("/auth/login", data);
        return response.data;
    },

    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>("/auth/register", data);
        return response.data;
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
