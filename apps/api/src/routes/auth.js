import { auth, validateToken, logout, refreshToken } from "../controllers/authController.js";

export default async function (fastify) {
    fastify.post("/", auth)
    fastify.post("/refresh", refreshToken)
    fastify.get("/validate", validateToken)
    fastify.post("/logout", logout)
}