import { createClass, getClasses, getClassById } from '../controllers/classController.js'

export default async function (fastify) {
  fastify.get('/', getClasses)
  fastify.get('/:id', getClassById)
  fastify.post('/', createClass)
}
