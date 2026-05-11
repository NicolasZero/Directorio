import { getDirectories, getDirectoryById, createDirectory } from '../controllers/directoryController.js'

export default async function (fastify) {
    fastify.get('/', getDirectories)
    fastify.get('/:id', getDirectoryById)
    fastify.post('/', createDirectory)
}