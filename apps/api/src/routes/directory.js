import { authenticate } from '../middlewares/authMiddleware.js'
import {
  getDirectories,
  getDirectoryById,
  createDirectory,
  updateDirectory,
  deleteDirectory,
  getCountDirectory,
  getDirectoryStateCounts,
  getDirectoryMunicipalities,
  getAllDirectories,
  getAdminCenters,
  getAdminFilters,
  getAdminCenterById,
  createAdminCenter,
  updateAdminCenter,
  deleteAdminCenter,
  checkCenterDuplicate,
} from '../controllers/directoryController.js'

export default async function (fastify) {
  // GET routes are public
  fastify.get('/', getDirectories)
  fastify.get('/all', getAllDirectories)
  fastify.get('/count', getCountDirectory)
  fastify.get('/state-counts', getDirectoryStateCounts)
  fastify.get('/municipalities', getDirectoryMunicipalities)
  fastify.get('/:id', getDirectoryById)

  // Protected routes: require authentication
  fastify.post('/', { preHandler: authenticate }, createDirectory)
  fastify.put('/:id', { preHandler: authenticate }, updateDirectory)
  fastify.delete('/:id', { preHandler: authenticate }, deleteDirectory)

  // ---- Admin panel (agrupado por organismo + defensoras) ----
  // NOTA: se registran ANTES de /:id para evitar que "admin" se
  // capture como un id. Fastify evalúa rutas estáticas primero,
  // así que el orden no es estrictamente necesario, pero se
  // documenta por claridad.
  fastify.get('/admin/centers', { preHandler: authenticate }, getAdminCenters)
  fastify.get('/admin/filters', { preHandler: authenticate }, getAdminFilters)
  fastify.get('/admin/centers/:id', { preHandler: authenticate }, getAdminCenterById)
  fastify.post('/admin/check-duplicate', { preHandler: authenticate }, checkCenterDuplicate)
  fastify.post('/admin/centers', { preHandler: authenticate }, createAdminCenter)
  fastify.put('/admin/centers/:id', { preHandler: authenticate }, updateAdminCenter)
  fastify.delete('/admin/centers/:id', { preHandler: authenticate }, deleteAdminCenter)
}
