import { FastifyInstance } from "fastify";
import { UserDB } from "../db/user";
import { AuthService } from "../services/auth";
import { Login, loginSchema, Register, registerSchema } from "../schemas/auth";

export async function authRoutes(server: FastifyInstance) {
    const users = new UserDB(server);
    const auth = new AuthService(users);

    server.post<{ Body: Register }>(
        "/register",
        { schema: { body: registerSchema } },
        async (request, reply) => {
            try {
                const user = await auth.register(
                    request.body.username,
                    request.body.email,
                    request.body.password
                );

                return reply.code(201).send({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    imageUrl: user.imageUrl,
                    createdAt: user.createdAt
                });
            } catch (error) {
                return reply.code(400).send({
                    error: error instanceof Error ? error.message : "Registration failed"
                });
            }
        }
    );

    server.post<{ Body: Login }>(
        "/login",
        { schema: { body: loginSchema } },
        async (request, reply) => {
            try {
                const user = await auth.login(
                    request.body.email,
                    request.body.password
                );

                const token = server.jwt.sign({
                    id: user.id,
                    username: user.username
                });

                return reply.send({
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        imageUrl: user.imageUrl,
                        createdAt: user.createdAt
                    },
                    token
                });
            } catch (error) {
                return reply.code(401).send({
                    error: error instanceof Error ? error.message : "Login failed"
                });
            }
        }
    );

    server.get("/me", async (request, reply) => {
        try {
            await request.jwtVerify();

            const user = await users.findById(request.user.id);

            if (!user) {
                return reply.code(404).send({
                    error: "User not found"
                });
            }

            return reply.send({
                id: user.id,
                username: user.username,
                email: user.email,
                imageUrl: user.imageUrl,
                createdAt: user.createdAt
            });
        } catch {
            return reply.code(401).send({
                error: "Unauthorized"
            });
        }
    });
}