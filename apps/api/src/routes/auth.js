import { auth, validateToken, logout } from "../controllers/authController.js";

export default async function (fastify) {
    fastify.post("/", auth)
    fastify.get("/validate", validateToken)
    fastify.post("/logout", logout)
}