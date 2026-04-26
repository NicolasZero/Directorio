import Fastify from 'fastify'
import cors from '@fastify/cors'
import fs from 'fs'
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const fastify = Fastify({
  logger: false // Activa o desactiva los logger
})

// Trata de cargar el .env de forma segura
try {
  // require('dotenv').config()
  process.loadEnvFile()
} catch (error) {
  console.log('No se pudo cargar el archivo .env, asegúrate de que exista y tenga las variables de entorno necesarias.')
}

// extrae las variables de entorno o establece un valor por defecto
const {
  PORT = 3000,
  HOST_URL = 'http://localhost:5173'
} = process.env

// Habilita el Cross-Origin Resource Sharing (CORS)
fastify.register(cors, {
  origin: [HOST_URL]
})

// Obtiene la direccion de la ruta de este archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Obtiene la dirección de la carpeta de rutas
const pathRouter = `${__dirname}/routes`

// Genera automaticamente los prefijos para las rutas
fs.readdirSync(pathRouter).filter((file) => {
  const name = file.split('.')
  const route = name[0]

  if (name[1] === 'ignore') return 0

  if (route == 'index') {
    fastify.register(import(`./routes/${route}.js`), { prefix: `/api` })
    return 0
  }

  fastify.register(import(`./routes/${route}.js`), { prefix: `/api/${route}` })
  console.log(`EndPoints--->/api/${route}`)
})

fastify.get('/', async (request, reply) => {
  return { message: 'API INAMUJER online' }
})

const start = async () => {
  const port = PORT;
  // const host = HOST ;
  try {
    // Start the server on port 3000, listening on all network interfaces
    await fastify.listen({ port });
    // Log a message to indicate that the API is online
    console.log(`API running on the port ${port}`);
  } catch (err) {
    // Log any error that occurs during server startup and exit the process
    fastify.log.error(err);
    process.exit(1);
  }
};

start()