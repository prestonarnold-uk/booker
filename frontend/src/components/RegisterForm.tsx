import { useState } from "react";
import type { SubmitEvent } from "react";

interface FormErrors {
    username?: string;
    email?: string;
    password?: string;
    general?: string;
}

export function RegisterForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    function validate(): FormErrors {
        const errors: FormErrors = {};

        if (!username.trim()) {
            errors.username = "Username is required";
        } else if (username.trim().length < 3) {
            errors.username = "Username must be at least 3 characters";
        } else if (username.trim().length > 30) {
            errors.username = "Username must be 30 characters or less";
        }

        if (!email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Enter a valid email address";
        }

        if (!password) {
            errors.password = "Password is required";
        } else if (password.length < 8) {
            errors.password = "Password must be at least 8 characters";
        }

        return errors;
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const response = await fetch("http://localhost:3001/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username.trim(),
                    email: email.trim(),
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({
                    general: data.error || "Registration failed"
                });
                return;
            }

            window.location.href = "/login";
        } catch {
            setErrors({
                general: "Unable to connect to the server"
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="auth-form-fields" onSubmit={handleSubmit}>
            <div className="auth-field">
                <label htmlFor="username">Username</label>

                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) => {
                        const value = event.target.value;
                        setUsername(value);

                        if (value.trim().length >= 3 && value.trim().length <= 30) {
                            setErrors((current) => ({
                                ...current,
                                username: undefined
                            }));
                        }
                    }}
                    placeholder="johnsmith"
                    autoComplete="username"
                    aria-invalid={!!errors.username}
                />

                {errors.username && (
                    <span className="auth-field-error">
                        {errors.username}
                    </span>
                )}
            </div>

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
                    <span className="auth-field-error">
                        {errors.email}
                    </span>
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

                        if (value.length >= 8) {
                            setErrors((current) => ({
                                ...current,
                                password: undefined
                            }));
                        }
                    }}
                    placeholder="Your password"
                    autoComplete="new-password"
                    aria-invalid={!!errors.password}
                />

                {errors.password && (
                    <span className="auth-field-error">
                        {errors.password}
                    </span>
                )}
            </div>

            {errors.general && (
                <p className="auth-error">
                    {errors.general}
                </p>
            )}

            <button
                className="auth-submit"
                type="submit"
                disabled={loading}
            >
                {loading ? "Creating account..." : "Create account"}
            </button>
        </form>
    );
}