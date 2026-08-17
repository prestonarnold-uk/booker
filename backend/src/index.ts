import Fastify, { FastifyInstance } from "fastify";
import fpSqlitePlugin from "fastify-sqlite-typed";
import { authRoutes } from "./routes/auth";

export const server: FastifyInstance = Fastify({
    logger: true,
});

server.register(fpSqlitePlugin, {
    dbFilename: "./db/db.sqlite",
})

server.register(authRoutes, { prefix: "/auth" });

const start = async () => {
    try {
        await server.listen({ port: 3001 }) // todo: check env for this one.

        const address = server.server.address()
        const port = typeof address === "string" ? address : address?.port

    } catch (error) {
        server.log.error(error)
        process.exit(1)
    }
}

start()