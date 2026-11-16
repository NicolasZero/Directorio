import { authenticate } from '../middlewares/authMiddleware.js'
import { authorizeNews } from '../middlewares/newsMiddleware.js'
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  createNews,
  deleteNews,
  getNews,
  getNewsById,
  updateNews,
} from '../controllers/newsController.js'

const uploadDirectory = fileURLToPath(new URL('../../uploads/news/', import.meta.url))
const maxImageSize = 5 * 1024 * 1024
const imageTypes = {
  'image/jpeg': { extension: 'jpg', signature: (buffer) => buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff },
  'image/png': { extension: 'png', signature: (buffer) => buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) },
  'image/webp': { extension: 'webp', signature: (buffer) => buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP' },
  'image/gif': { extension: 'gif', signature: (buffer) => ['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6)) },
}

export default async function (fastify) {
  fastify.get('/', getNews)
  fastify.get('/manage', { preHandler: [authenticate, authorizeNews] }, getNews)
  fastify.get('/manage/:id', { preHandler: [authenticate, authorizeNews] }, getNewsById)
  fastify.get('/images', {
    preHandler: [authenticate, authorizeNews],
  }, async (request, reply) => {
    try {
      const entries = await readdir(uploadDirectory, { withFileTypes: true })
      const images = await Promise.all(
        entries
          .filter((entry) => entry.isFile() && /^[0-9a-f-]{36}\.(jpg|png|webp|gif)$/.test(entry.name))
          .map(async (entry) => ({
            url: `/api/news/images/${entry.name}`,
            updatedAt: (await stat(join(uploadDirectory, entry.name))).mtime.toISOString(),
          }))
      )
      images.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))

      return reply.code(200).send({ status: 'OK', data: images })
    } catch (error) {
      if (error.code === 'ENOENT') {
        return reply.code(200).send({ status: 'OK', data: [] })
      }

      request.log.error(error)
      return reply.code(500).send({ status: 'failed', error: 'No se pudieron cargar las imágenes.' })
    }
  })
  fastify.get('/images/:filename', async (request, reply) => {
    const { filename } = request.params
    const match = /^([0-9a-f-]{36})\.(jpg|png|webp|gif)$/.exec(filename)

    if (!match) {
      return reply.code(404).send({ status: 'NOT_FOUND', error: 'Imagen no encontrada.' })
    }

    try {
      const image = await readFile(join(uploadDirectory, filename))
      const contentType = Object.entries(imageTypes).find(([, type]) => type.extension === match[2])?.[0]

      return reply
        .header('Content-Type', contentType)
        .header('Cache-Control', 'public, max-age=31536000, immutable')
        .header('X-Content-Type-Options', 'nosniff')
        .send(image)
    } catch (error) {
      if (error.code === 'ENOENT') {
        return reply.code(404).send({ status: 'NOT_FOUND', error: 'Imagen no encontrada.' })
      }

      request.log.error(error)
      return reply.code(500).send({ status: 'failed', error: 'No se pudo cargar la imagen.' })
    }
  })
  fastify.get('/:id', getNewsById)

  fastify.post('/', { preHandler: [authenticate, authorizeNews] }, createNews)
  fastify.post('/images', {
    bodyLimit: 7 * 1024 * 1024,
    preHandler: [authenticate, authorizeNews],
  }, async (request, reply) => {
    const { image } = request.body || {}
    const match = typeof image === 'string'
      ? /^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/]+={0,2})$/.exec(image)
      : null

    if (!match) {
      return reply.code(400).send({ status: 'BAD_REQUEST', error: 'Selecciona una imagen JPG, PNG, WEBP o GIF válida.' })
    }

    const [, mimeType, encodedImage] = match
    const buffer = Buffer.from(encodedImage, 'base64')
    const imageType = imageTypes[mimeType]

    if (
      buffer.length === 0 ||
      buffer.length > maxImageSize ||
      buffer.toString('base64') !== encodedImage ||
      !imageType.signature(buffer)
    ) {
      return reply.code(400).send({ status: 'BAD_REQUEST', error: 'La imagen es inválida o supera el máximo de 5 MB.' })
    }

    try {
      await mkdir(uploadDirectory, { recursive: true })
      const filename = `${randomUUID()}.${imageType.extension}`
      await writeFile(join(uploadDirectory, filename), buffer, { flag: 'wx' })

      return reply.code(201).send({ status: 'CREATED', url: `/api/news/images/${filename}` })
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ status: 'failed', error: 'No se pudo almacenar la imagen.' })
    }
  })
  fastify.put('/:id', { preHandler: [authenticate, authorizeNews] }, updateNews)
  fastify.delete('/:id', { preHandler: [authenticate, authorizeNews] }, deleteNews)
}
