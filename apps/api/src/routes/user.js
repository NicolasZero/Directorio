import { authenticate } from '../middlewares/authMiddleware.js'
import { deleteUser, updatetUser, getUserById, getAllUser, createUser, getAllRol } from '../controllers/userController.js'

export default async function (fastify) {
    fastify.addHook('preHandler', authenticate)

    fastify.get('/', getAllUser)
    fastify.get('/:id', getUserById)
    fastify.post('/', createUser)
    fastify.put('/', updatetUser)
    fastify.delete('/:id', deleteUser)
    // fastify.patch('/', changeUserStatus)

    // Roles
    fastify.get('/roles', getAllRol)
}