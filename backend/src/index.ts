import Fastify, { FastifyInstance } from "fastify";

export const server: FastifyInstance = Fastify({
    logger: true,
})

server.get('/ping', async (request, reply) => {
  return { pong: 'it worked!' }
})

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