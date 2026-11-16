import { getMapCenters } from '../controllers/mapController.js'

export default async function (fastify) {
  fastify.get('/centers', getMapCenters)
}
