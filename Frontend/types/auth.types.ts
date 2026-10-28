export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role?: "ADMIN" | "PROJECT_MANAGER" | "MEMBER";
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "PROJECT_MANAGER" | "MEMBER";
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token: string;
    user: AuthUser;
}

export interface MeResponse {
    success: boolean;
    user: AuthUser;
}
