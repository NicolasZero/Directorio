import { authenticate } from '../middlewares/authMiddleware.js'
import { createClass, getClasses, getClassById, updateClass, deleteClass } from '../controllers/classController.js'

export default async function (fastify) {
  fastify.addHook('preHandler', authenticate)
  fastify.get('/', getClasses)
  fastify.get('/:id', getClassById)
  fastify.post('/', createClass)
  fastify.put('/:id', updateClass)
  fastify.delete('/:id', deleteClass)
}
