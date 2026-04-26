const index = async (fastify) => {
    fastify.get('/', async (request, reply) => {
        return { hello: 'world' }
    })
}

export default index