import { FastifyInstance } from "fastify";
import { BookDB } from "../db/book";

export async function bookRoutes(server: FastifyInstance) {
    const books = new BookDB(server);

    server.post("/", async (request, reply) => {
        await request.jwtVerify();

        const userId = request.user.id;

        const book = request.body as {
            title: string;
            author: string;
            isbn?: string;
            coverUrl?: string;
            description?: string;
            publisher?: string;
            publishedDate?: string;
            pageCount?: number;
            status: "currently_reading" | "finished" | "abandoned";
            startedAt?: string;
            finishedAt?: string;
            rating?: number;
            review?: string;
            notes?: string;
            isPublic?: boolean;
        };

        const createdBook = await books.create({
            userId,
            title: book.title,
            author: book.author,
            isbn: book.isbn ?? null,
            coverUrl: book.coverUrl ?? null,
            description: book.description ?? null,
            publisher: book.publisher ?? null,
            publishedDate: book.publishedDate ?? null,
            pageCount: book.pageCount ?? null,
            status: book.status,
            startedAt: book.startedAt ?? null,
            finishedAt: book.finishedAt ?? null,
            rating: book.rating ?? null,
            review: book.review ?? null,
            notes: book.notes ?? null,
            isPublic: book.isPublic ?? true,
        });

        return reply.code(201).send(createdBook);
    });

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
}