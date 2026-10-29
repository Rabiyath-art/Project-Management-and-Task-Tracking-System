
export interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "MEMBER";
    createdAt?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface AuthResult {
    success: boolean;
    message: string;
    user: User;
    token: string;
}

export interface MeResponse {
    success: boolean;
    data: {
        user: User;
    };
}
