import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { clearToken, useCurrentUser } from "../lib/auth";

export const Route = createFileRoute("/")({
    component: Home
});

function Home() {
    const navigate = useNavigate();
    const { data: user, isLoading, isError } = useCurrentUser();

    if (isLoading) {
        return <main style={{ padding: "2rem" }}>Loading...</main>;
    }

    if (!user || isError) {
        clearToken();
        navigate({ to: "/auth/login" });
        return <main style={{ padding: "2rem" }}>Redirecting...</main>;
    }

    return (
        <main style={{ padding: "2rem" }}>
            <h1>Welcome, {user.username}!</h1>
        </main>
    );
}