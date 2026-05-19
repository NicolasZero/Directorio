import { getAdminStats } from '../controllers/adminController.js'

export default async function (fastify) {
  fastify.get('/stats', getAdminStats)
}
