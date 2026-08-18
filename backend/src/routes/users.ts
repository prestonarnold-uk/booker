import { FastifyInstance } from "fastify";
import { UserDB } from "../db/user";
import { BookDB } from "../db/book";

export async function userRoutes(server: FastifyInstance) {
    const users = new UserDB(server);
    const books = new BookDB(server);

    server.get<{ Params: { username: string } }>(
        "/:username",
        async (request, reply) => {
            const { username } = request.params;
            const user = await users.findByUsername(username);

            if (!user) {
                return reply.code(404).send({
                    error: "User not found"
                });
            }

            const publicBooks = await books.findPublicByUserId(user.id);

            return reply.send({
                id: user.id,
                username: user.username,
                imageUrl: user.imageUrl,
                createdAt: user.createdAt,
                books: publicBooks
            });
        }
    );
}
