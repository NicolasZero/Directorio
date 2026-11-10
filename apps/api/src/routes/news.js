import { authenticate } from '../middlewares/authMiddleware.js'
import { authorizeNews } from '../middlewares/newsMiddleware.js'
import {
  createNews,
  deleteNews,
  getNews,
  getNewsById,
  updateNews,
} from '../controllers/newsController.js'

export default async function (fastify) {
  fastify.get('/', getNews)
  fastify.get('/:id', getNewsById)

  fastify.post('/', { preHandler: [authenticate, authorizeNews] }, createNews)
  fastify.put('/:id', { preHandler: [authenticate, authorizeNews] }, updateNews)
  fastify.delete('/:id', { preHandler: [authenticate, authorizeNews] }, deleteNews)
}
