export interface AuthUser {
    id: number;
    username: string;
    email: string;
    imageUrl: string | null;
    createdAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface LoginResponse {
    user: AuthUser;
    token: string;
}
