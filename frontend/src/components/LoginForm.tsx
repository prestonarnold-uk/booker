import { useState } from "react";
import type { SubmitEvent } from "react";
import { useLogin } from "../lib/auth";

interface FormErrors {
    email?: string;
    password?: string;
    general?: string;
}

export function LoginForm() {
    const loginMutation = useLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});

    function validate(): FormErrors {
        const validationErrors: FormErrors = {};

        if (!email.trim()) {
            validationErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            validationErrors.email = "Enter a valid email address";
        }

        if (!password) {
            validationErrors.password = "Password is required";
        }

        return validationErrors;
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        try {
            await loginMutation.mutateAsync({
                email: email.trim(),
                password,
            });
        } catch (error) {
            setErrors({
                general: error instanceof Error ? error.message : "Login failed",
            });
        }
    }

    return (
        <form className="auth-form-fields" onSubmit={handleSubmit}>
            <div className="auth-field">
                <label htmlFor="email">Email</label>

                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                        const value = event.target.value;
                        setEmail(value);

                        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                            setErrors((current) => ({
                                ...current,
                                email: undefined
                            }));
                        }
                    }}
                    placeholder="john@example.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                />

                {errors.email && (
                    <span className="auth-field-error">{errors.email}</span>
                )}
            </div>

            <div className="auth-field">
                <label htmlFor="password">Password</label>

                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => {
                        const value = event.target.value;
                        setPassword(value);

                        if (value.length > 0) {
                            setErrors((current) => ({
                                ...current,
                                password: undefined
                            }));
                        }
                    }}
                    placeholder="Your password"
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                />

                {errors.password && (
                    <span className="auth-field-error">{errors.password}</span>
                )}
            </div>

            {errors.general && (
                <p className="auth-error">{errors.general}</p>
            )}

            <button
                className="auth-submit"
                type="submit"
                disabled={loginMutation.isPending}
            >
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </button>
        </form>
    );
}
