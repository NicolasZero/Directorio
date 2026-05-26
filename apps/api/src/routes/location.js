import { authenticate } from "../middlewares/authMiddleware.js"
import { statesAll, stateById, municipalitiesAll, municipalityByStateId, allLocations } from "../controllers/locationController.js"

export default async function (fastify) {
    fastify.addHook("preHandler", authenticate)
    fastify.get("/", allLocations)
    fastify.get("/state", statesAll)
    fastify.get("/state/:id", stateById)
    fastify.get("/state/:id/municipality", municipalityByStateId)
    fastify.get("/municipality", municipalitiesAll)
}
