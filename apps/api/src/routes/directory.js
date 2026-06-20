import { authenticate } from '../middlewares/authMiddleware.js'
import { getDirectories, getDirectoryById, createDirectory, updateDirectory, deleteDirectory, getCountDirectory, getAllDirectories } from '../controllers/directoryController.js'

export default async function (fastify) {
    // GET routes are public
    fastify.get('/', getDirectories)
    fastify.get('/all', getAllDirectories)
    fastify.get('/:id', getDirectoryById)
    fastify.get('/count', getCountDirectory)

    // Protected routes: require authentication
    fastify.post('/', { preHandler: authenticate }, createDirectory)
    fastify.put('/:id', { preHandler: authenticate }, updateDirectory)
    fastify.delete('/:id', { preHandler: authenticate }, deleteDirectory)
}