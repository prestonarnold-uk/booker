import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "../../components/AuthLayout";
import { RegisterForm } from "../../components/RegisterForm";

export const Route = createFileRoute("/auth/register")({
    component: Register
});

function Register() {
    return (
        <AuthLayout
            title="Create your account"
            description="Build your library and share what you're reading."
        >
            <RegisterForm />
        </AuthLayout>
    );
}