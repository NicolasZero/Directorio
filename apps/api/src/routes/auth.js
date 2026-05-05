import { auth } from "../controllers/authController.js";

export default async function (fastify) {
    fastify.post("/", auth)
}
