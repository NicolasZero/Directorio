import { testController, testDb } from '../controllers/test.controller.js'

const test = async (fastify) => {
    fastify.get("/", async (request, reply) => {
        return { test: 'test' }
        // return reply.code(200).send({ data: "hola", status: "OK" });
    })
    fastify.get("/controller", testController)
    fastify.get("/db", testDb)
}

export default test