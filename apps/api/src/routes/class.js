import { authenticate } from '../middlewares/authMiddleware.js'
import { createClass, getClasses, getClassById, updateClass, deleteClass, getCountClasses } from '../controllers/classController.js'

export default async function (fastify) {
  // GET routes are public
  fastify.get('/', getClasses)
  fastify.get('/count', getCountClasses)
  fastify.get('/:id', getClassById)

  // Protected routes: require authentication
  fastify.post('/', { preHandler: authenticate }, createClass)
  fastify.put('/:id', { preHandler: authenticate }, updateClass)
  fastify.delete('/:id', { preHandler: authenticate }, deleteClass)
}
