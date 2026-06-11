import { authenticate } from '../middlewares/authMiddleware.js'
import { getDirectories, getDirectoryById, createDirectory, updateDirectory, deleteDirectory } from '../controllers/directoryController.js'

export default async function (fastify) {
    // GET routes are public
    fastify.get('/', getDirectories)
    fastify.get('/:id', getDirectoryById)

    // Protected routes: require authentication
    fastify.post('/', { preHandler: authenticate }, createDirectory)
    fastify.put('/:id', { preHandler: authenticate }, updateDirectory)
    fastify.delete('/:id', { preHandler: authenticate }, deleteDirectory)
}