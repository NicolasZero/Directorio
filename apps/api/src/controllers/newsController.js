import query from '../database/postgre.js'
import sanitizeHtml from 'sanitize-html'

const newsHtmlOptions = {
  allowedTags: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'a', 'span', 'div', 'img'],
  allowedAttributes: {
    a: ['href'],
    img: ['src', 'alt', 'style'],
    p: ['style'],
    h2: ['style'],
    h3: ['style'],
    blockquote: ['style'],
    span: ['style'],
    div: ['style'],
  },
  allowedStyles: {
    '*': {
      color: [/^(#[\da-f]{3,8}|[a-z]{3,20}|rgba?\([\d.,%\s]+\))$/i],
      'font-size': [/^(8|9|1\d|2\d|3\d|4[0-8])px$/],
      'text-align': [/^(left|center|right|justify)$/],
    },
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowProtocolRelative: false,
  allowRelativeUrls: true,
}

const isValidDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

const getNewsInput = (body) => {
  const {
    title,
    summary,
    content,
    category = 'General',
    image = '',
    publishedAt = null,
    status = null,
  } = body || {}

  if (
    typeof title !== 'string' ||
    !title.trim() ||
    typeof summary !== 'string' ||
    !summary.trim() ||
    typeof content !== 'string' ||
    !content.trim() ||
    typeof category !== 'string' ||
    (image !== null && typeof image !== 'string') ||
    (publishedAt !== null && !isValidDate(publishedAt)) ||
    (status !== null && !['Borrador', 'Publicado'].includes(status))
  ) {
    return null
  }

  const cleanContent = sanitizeHtml(content.trim(), newsHtmlOptions)

  if (!cleanContent.replace(/<[^>]*>/g, '').trim()) return null

  return {
    title: title.trim(),
    summary: summary.trim(),
    content: cleanContent,
    category: category.trim() || 'General',
    image: typeof image === 'string' ? image.trim() || null : null,
    publishedAt,
    status,
  }
}

export const getNews = async (request, reply) => {
  const { limit, page = '1' } = request.query || {}
  const parsedPage = Number.parseInt(page, 10)
  const parsedLimit = limit === undefined ? null : Number.parseInt(limit, 10)

  if (
    !Number.isInteger(parsedPage) ||
    parsedPage < 1 ||
    (limit !== undefined && (!Number.isInteger(parsedLimit) || parsedLimit < 1))
  ) {
    return reply.code(400).send({ status: 'failed', error: 'Parámetros de paginación inválidos.' })
  }

  try {
    const values = []
    const conditions = request.newsRole === 'Administrador' ? '' : "WHERE status = 'Publicado'"
    let pagination = ''

    if (parsedLimit !== null) {
      const safeLimit = Math.min(parsedLimit, 100)
      values.push(safeLimit, (parsedPage - 1) * safeLimit)
      pagination = 'LIMIT $1 OFFSET $2'
    }

    const result = await query(
      `SELECT id, title, summary, content, category, image, status, published_at, created_at, updated_at
       FROM news
       ${conditions}
       ORDER BY published_at DESC NULLS LAST, created_at DESC
       ${pagination}`,
      values
    )

    return reply.code(200).send({ status: 'OK', data: result.rows })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'No se pudieron cargar las noticias.' })
  }
}

export const getNewsById = async (request, reply) => {
  const { id } = request.params

  try {
    const result = await query(
      `SELECT id, title, summary, content, category, image, status, published_at, created_at, updated_at
       FROM news
       WHERE id = $1
         AND ($2::boolean OR status = 'Publicado')`,
      [id, request.newsRole === 'Administrador']
    )

    if (result.rowCount === 0) {
      return reply.code(404).send({ status: 'NOT_FOUND', error: 'Noticia no encontrada.' })
    }

    return reply.code(200).send({ status: 'OK', data: result.rows[0] })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'No se pudo cargar la noticia.' })
  }
}

export const createNews = async (request, reply) => {
  const news = getNewsInput(request.body)

  if (!news) {
    return reply.code(400).send({
      status: 'BAD_REQUEST',
      error: 'Título, resumen y contenido son obligatorios; revisa también la fecha.',
    })
  }

  try {
    const result = await query(
      `INSERT INTO news (title, summary, content, category, image, status, published_at)
       VALUES ($1, $2, $3, $4, $5, 'Borrador', COALESCE($6::date, CURRENT_DATE))
       RETURNING id`,
      [news.title, news.summary, news.content, news.category, news.image, news.publishedAt]
    )

    return reply.code(201).send({ status: 'CREATED', id: result.rows[0].id })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'No se pudo crear la noticia.' })
  }
}

export const updateNews = async (request, reply) => {
  const { id } = request.params
  const news = getNewsInput(request.body)

  if (!news) {
    return reply.code(400).send({
      status: 'BAD_REQUEST',
      error: 'Título, resumen y contenido son obligatorios; revisa también la fecha.',
    })
  }

  try {
    const result = await query(
      `UPDATE news
       SET title = $1,
           summary = $2,
           content = $3,
           category = $4,
           image = $5,
           status = CASE WHEN $8 = 'Administrador' THEN COALESCE($7, status) ELSE status END,
           published_at = $6::date,
           updated_at = NOW()
       WHERE id = $9
         AND (status = 'Publicado' OR $8 = 'Administrador')`,
      [
        news.title,
        news.summary,
        news.content,
        news.category,
        news.image,
        news.publishedAt,
        news.status,
        request.newsRole,
        id,
      ]
    )

    if (result.rowCount === 0) {
      return reply.code(404).send({ status: 'NOT_FOUND', error: 'Noticia no encontrada.' })
    }

    return reply.code(200).send({ status: 'OK', message: 'Noticia actualizada correctamente.' })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'No se pudo actualizar la noticia.' })
  }
}

export const deleteNews = async (request, reply) => {
  const { id } = request.params

  try {
    const result = await query(
      `DELETE FROM news
       WHERE id = $1
         AND (status = 'Publicado' OR $2 = 'Administrador')`,
      [id, request.newsRole]
    )

    if (result.rowCount === 0) {
      return reply.code(404).send({ status: 'NOT_FOUND', error: 'Noticia no encontrada.' })
    }

    return reply.code(200).send({ status: 'OK', message: 'Noticia eliminada correctamente.' })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'No se pudo eliminar la noticia.' })
  }
}
