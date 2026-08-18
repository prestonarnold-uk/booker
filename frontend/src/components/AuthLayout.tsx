import type { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <main className="auth-layout">
            <section className="auth-image">
                <img src="/auth.jpg" alt="Books" />

                <div className="auth-image-content">
                    <span className="auth-logo">Booker</span>
                </div>
            </section>

            <section className="auth-content">
                <div className="auth-form">
                    <header className="auth-header">
                        <h1>{title}</h1>
                        <p>{description}</p>
                    </header>

                    {children}
                </div>
            </section>
        </main>
    );
}