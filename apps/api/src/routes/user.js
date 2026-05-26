import { authenticate } from '../middlewares/authMiddleware.js'
import { deleteUser, updatetUser, getUserById, getAllUser, changeUserStatus, createUser } from '../controllers/userController.js'

export default async function (fastify) {
    fastify.addHook('preHandler', authenticate)

    fastify.get('/', getAllUser)
    fastify.get('/id/:id', getUserById)
    fastify.post('/', createUser)
    fastify.put('/', updatetUser)
    fastify.delete('/:id', deleteUser)
    fastify.patch('/', changeUserStatus)
}