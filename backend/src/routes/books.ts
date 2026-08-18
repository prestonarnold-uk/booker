import { FastifyInstance } from "fastify";
import { BookDB } from "../db/book";
import { CreateBook, createBookSchema, UpdateBook, updateBookSchema } from "../schemas/book";

export async function bookRoutes(server: FastifyInstance) {
    const books = new BookDB(server);

    server.post<{ Body: CreateBook }>(
        "/",
        { schema: { body: createBookSchema } },
        async (request, reply) => {
            await request.jwtVerify();

            const createdBook = await books.create(request.user.id, request.body);

            return reply.code(201).send(createdBook);
        }
    );

    server.get("/", async (request) => {
        await request.jwtVerify();

        return books.findByUserId(request.user.id);
    });

    server.get("/:id", async (request, reply) => {
        await request.jwtVerify();

        const { id } = request.params as { id: string };
        const book = await books.findById(Number(id));

        if (!book || book.userId !== request.user.id) {
            return reply.code(404).send({
                error: "Book not found"
            });
        }

        return book;
    });

    server.patch<{ Params: { id: string }, Body: UpdateBook }>(
    "/:id",
    { schema: { body: updateBookSchema } },
    async (request, reply) => {
        await request.jwtVerify();

        const { id } = request.params;
        const book = await books.findById(Number(id));

        if (!book || book.userId !== request.user.id) {
            return reply.code(404).send({
                error: "Book not found"
            });
        }

        const updatedBook = await books.update(book.id, request.body);

        return reply.send(updatedBook);
    }
);

    server.delete("/:id", async (request, reply) => {
        await request.jwtVerify();

        const { id } = request.params as { id: string };
        const book = await books.findById(Number(id));

        if (!book || book.userId !== request.user.id) {
            return reply.code(404).send({
                error: "Book not found"
            });
        }

        await books.delete(book.id);

        return reply.code(204).send();
    });
}