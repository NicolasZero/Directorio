import { saveAbout, getAbout } from "../controllers/aboutController.js";

const aboutRoutes = async (fastify) => {
  fastify.get('/', getAbout);
  fastify.post('/', { schema: { body: {} } }, saveAbout);
};

export default aboutRoutes;
