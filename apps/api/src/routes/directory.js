import { getDirectories, getDirectoryById } from '../controllers/directoryController.js'

export default async function (fastify) {
    fastify.get('/', getDirectories)
    fastify.get('/:id', getDirectoryById)
}