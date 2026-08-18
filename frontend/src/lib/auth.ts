import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { AuthUser, LoginRequest, LoginResponse, RegisterRequest } from "./auth.types";

const API_BASE_URL = "http://localhost:3001";
export const TOKEN_STORAGE_KEY = "booker_token";

export function getStoredToken(): string | null {
    if (typeof window === "undefined") {
        return null;
    }

    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function storeToken(token: string) {
    if (typeof window !== "undefined") {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
}

export function clearToken() {
    if (typeof window !== "undefined") {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
}

export function apiFetch(path: string, options: RequestInit = {}) {
    const token = getStoredToken();
    const headers = new Headers(options.headers);

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers
    });
}

export async function getCurrentUser(): Promise<AuthUser> {
    const response = await apiFetch("/auth/me");

    if (!response.ok) {
        throw new Error("Unable to load current user");
    }

    return response.json();
}

async function requestJson<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await apiFetch(path, options);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.error || "Request failed");
    }

    return data;
}

export function useCurrentUser() {
    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: getCurrentUser,
        retry: false,
        enabled: !!getStoredToken(),
    });
}

export function useLogin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (payload: LoginRequest) => {
            const response = await requestJson<LoginResponse>("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            return response;
        },
        onSuccess: (data) => {
            storeToken(data.token);
            queryClient.setQueryData(["auth", "me"], data.user);
            navigate({ to: "/" });
        },
    });
}

export function useRegister() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (payload: RegisterRequest) => {
            await requestJson<{ message?: string }>("/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
        },
        onSuccess: () => {
            navigate({ to: "/auth/login" });
        },
    });
}
