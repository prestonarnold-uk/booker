export type BookStatus = | "currently_reading" | "finished" | "abandoned";

export interface Book {
    id: number;
    userId: number;
    title: string;
    author: string;
    isbn?: string | null;
    coverUrl?: string | null;
    description?: string | null;
    publisher?: string | null;
    publishedDate?: string | null;
    pageCount?: number | null;
    status: BookStatus;
    startedAt?: string | null;
    finishedAt?: string | null;
    rating?: number | null;
    review?: string | null;
    notes?: string | null;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}