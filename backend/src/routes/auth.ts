import { FastifyInstance } from "fastify";
import { UserDB } from "../db/user";
import { AuthService } from "../services/auth";

export async function authRoutes(server: FastifyInstance) {
    const users = new UserDB(server);
    const auth = new AuthService(users);

    server.post("/register", async (request, reply) => {
        const { username, email, password } = request.body as {
            username: string;
            email: string;
            password: string;
        };

        try {
            const user = await auth.register(username, email, password);

            return reply.code(201).send({
                id: user.id,
                username: user.username,
                email: user.email,
                imageUrl: user.imageUrl,
                createdAt: user.createdAt,
            });
        } catch (error) {
            return reply.code(400).send({
                error: error instanceof Error ? error.message : "Registration failed"
            });
        }
    });

    server.post("/login", async (request, reply) => {
        const { email, password } = request.body as {
            email: string;
            password: string;
        };

        try {
            const user = await auth.login(email, password);

            const token = server.jwt.sign({
                id: user.id,
                username: user.username,
            });

            return reply.send({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    imageUrl: user.imageUrl,
                    createdAt: user.createdAt,
                },
                token
            });
        } catch (error) {
            return reply.code(401).send({
                error: error instanceof Error ? error.message : "Login failed"
            });
        }
    });
}