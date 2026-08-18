import Fastify, { FastifyInstance } from "fastify";

import cors from '@fastify/cors'
import fpSqlitePlugin from "fastify-sqlite-typed";
import fastifyJwt from "@fastify/jwt";

import { authRoutes } from "./routes/auth";
import { bookRoutes } from "./routes/books";
import { userRoutes } from "./routes/users";

export const server: FastifyInstance = Fastify({
    logger: true,
});

server.register(cors, {
    origin: true,
    credentials: true,
});

server.register(fpSqlitePlugin, {
    dbFilename: "./db/db.sqlite",
});

server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "development-secret",
});

server.register(authRoutes, { prefix: "/auth" });
server.register(bookRoutes, { prefix: "/books" });
server.register(userRoutes, { prefix: "/users" });

const start = async () => {
    try {
        await server.listen({ port: 3001, host: "0.0.0.0" });

        const address = server.server.address();
        const port = typeof address === "string" ? address : address?.port;

        server.log.info(`Server listening on port ${port}`);
    } catch (error) {
        server.log.error(error);
        process.exit(1);
    }
};

start()