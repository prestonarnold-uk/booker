import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "../../components/AuthLayout";
import { LoginForm } from "../../components/LoginForm";

export const Route = createFileRoute("/auth/login")({
    component: Login
});

function Login() {
    return (
        <AuthLayout
            title="Sign in"
            description="Welcome back!"
        >
            <LoginForm />
        </AuthLayout>
    );
}
