// this dosen't cover pretty much anything, and will be need to grow once needed.

import { FastifyInstance } from "fastify";
import { Book } from "../models/Book";

export class BookDB {
    constructor(private server: FastifyInstance) { }

    async create(book: Omit<Book, "id" | "createdAt" | "updatedAt">): Promise<Book> {
        const result = await this.server.db.run("INSERT INTO books (user_id, title, author, isbn, cover_url, description, publisher, published_date, page_count, status, started_at, finished_at, rating, review, notes, is_public) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", book.userId, book.title, book.author, book.isbn, book.coverUrl, book.description, book.publisher, book.publishedDate, book.pageCount, book.status, book.startedAt, book.finishedAt, book.rating, book.review, book.notes, book.isPublic);

        if (result.lastID === undefined) {
            throw new Error("Failed to create book");
        }

        const createdBook = await this.findById(result.lastID);

        if (!createdBook) {
            throw new Error("Failed to find created book");
        }

        return createdBook;
    }

    async findById(id: number): Promise<Book | undefined> {
        return this.server.db.get<Book>("SELECT id, user_id AS userId, title, author, isbn, cover_url AS coverUrl, description, publisher, published_date AS publishedDate, page_count AS pageCount, status, started_at AS startedAt, finished_at AS finishedAt, rating, review, notes, is_public AS isPublic, created_at AS createdAt, updated_at AS updatedAt FROM books WHERE id = ?", id);
    }

    async findByUserId(userId: number): Promise<Book[]> {
        return this.server.db.all<Book[]>("SELECT id, user_id AS userId, title, author, isbn, cover_url AS coverUrl, description, publisher, published_date AS publishedDate, page_count AS pageCount, status, started_at AS startedAt, finished_at AS finishedAt, rating, review, notes, is_public AS isPublic, created_at AS createdAt, updated_at AS updatedAt FROM books WHERE user_id = ?", userId);
    }
}