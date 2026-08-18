export const createBookSchema = {
    body: {
        type: "object",
        required: ["title", "author", "status"],
        properties: {
            title: { type: "string", minLength: 1 },
            author: { type: "string", minLength: 1 },
            isbn: { type: ["string", "null"] },
            coverUrl: { type: ["string", "null"] },
            description: { type: ["string", "null"] },
            publisher: { type: ["string", "null"] },
            publishedDate: { type: ["string", "null"] },
            pageCount: { type: ["integer", "null"], minimum: 1 },
            status: {
                type: "string",
                enum: ["currently_reading", "finished", "abandoned"]
            },
            startedAt: { type: ["string", "null"] },
            finishedAt: { type: ["string", "null"] },
            rating: { type: ["integer", "null"], minimum: 1, maximum: 5 },
            review: { type: ["string", "null"] },
            notes: { type: ["string", "null"] },
            isPublic: { type: "boolean" }
        },
        additionalProperties: false
    }
};