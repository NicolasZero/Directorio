import { authenticate } from '../middlewares/authMiddleware.js'
import { getDirectories, getDirectoryById, createDirectory, updateDirectory, deleteDirectory } from '../controllers/directoryController.js'

export default async function (fastify) {
    fastify.addHook('preHandler', authenticate)
    fastify.get('/', getDirectories)
    fastify.get('/:id', getDirectoryById)
    fastify.post('/', createDirectory)
    fastify.put('/:id', updateDirectory)
    fastify.delete('/:id', deleteDirectory)
}