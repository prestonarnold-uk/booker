// this dosen't cover pretty much anything, and will be need to grow once needed.

import { FastifyInstance } from "fastify";
import { Book } from "../models/Book";
import { CreateBook } from "../schemas/book";

export class BookDB {
    constructor(private server: FastifyInstance) { }

    async create(userId: number, book: CreateBook): Promise<Book> {
        const result = await this.server.db.run(
            "INSERT INTO books (user_id, title, author, isbn, cover_url, description, publisher, published_date, page_count, status, started_at, finished_at, rating, review, notes, is_public) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            userId,
            book.title,
            book.author,
            book.isbn ?? null,
            book.coverUrl ?? null,
            book.description ?? null,
            book.publisher ?? null,
            book.publishedDate ?? null,
            book.pageCount ?? null,
            book.status,
            book.startedAt ?? null,
            book.finishedAt ?? null,
            book.rating ?? null,
            book.review ?? null,
            book.notes ?? null,
            book.isPublic ?? true
        );

        if (result.lastID === undefined) {
            throw new Error("Failed to create book");
        }

        const createdBook = await this.findById(result.lastID);

        if (!createdBook) {
            throw new Error("Failed to find created book");
        }

        return createdBook;
    }

    async update(id: number, book: Partial<Omit<Book, "id" | "userId" | "createdAt" | "updatedAt">>): Promise<Book | undefined> {
        const fields = Object.keys(book);

        if (fields.length === 0) {
            return this.findById(id);
        }

        const columns: Record<string, string> = {
            title: "title",
            author: "author",
            isbn: "isbn",
            coverUrl: "cover_url",
            description: "description",
            publisher: "publisher",
            publishedDate: "published_date",
            pageCount: "page_count",
            status: "status",
            startedAt: "started_at",
            finishedAt: "finished_at",
            rating: "rating",
            review: "review",
            notes: "notes",
            isPublic: "is_public"
        };

        const updates = fields.map(field => `${columns[field]} = ?`).join(", ");
        const values = fields.map(field => book[field as keyof typeof book]);

        await this.server.db.run(`UPDATE books SET ${updates}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, ...values, id);

        return this.findById(id);
    }

    async delete(id: number): Promise<void> {
        await this.server.db.run("DELETE FROM books WHERE id = ?", id);
    }

    async findById(id: number): Promise<Book | undefined> {
        return this.server.db.get<Book>("SELECT id, user_id AS userId, title, author, isbn, cover_url AS coverUrl, description, publisher, published_date AS publishedDate, page_count AS pageCount, status, started_at AS startedAt, finished_at AS finishedAt, rating, review, notes, is_public AS isPublic, created_at AS createdAt, updated_at AS updatedAt FROM books WHERE id = ?", id);
    }

    async findByUserId(userId: number): Promise<Book[]> {
        return this.server.db.all<Book[]>("SELECT id, user_id AS userId, title, author, isbn, cover_url AS coverUrl, description, publisher, published_date AS publishedDate, page_count AS pageCount, status, started_at AS startedAt, finished_at AS finishedAt, rating, review, notes, is_public AS isPublic, created_at AS createdAt, updated_at AS updatedAt FROM books WHERE user_id = ?", userId);
    }
}