import query from '../database/postgre.js'

const isValidDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

const getNewsInput = (body) => {
  const { title, summary, content, category = 'General', image = '', publishedAt = null } = body || {}

  if (
    typeof title !== 'string' ||
    !title.trim() ||
    typeof summary !== 'string' ||
    !summary.trim() ||
    typeof content !== 'string' ||
    !content.trim() ||
    typeof category !== 'string' ||
    (image !== null && typeof image !== 'string') ||
    (publishedAt !== null && !isValidDate(publishedAt))
  ) {
    return null
  }

  return {
    title: title.trim(),
    summary: summary.trim(),
    content: content.trim(),
    category: category.trim() || 'General',
    image: typeof image === 'string' ? image.trim() || null : null,
    publishedAt,
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
    let pagination = ''

    if (parsedLimit !== null) {
      const safeLimit = Math.min(parsedLimit, 100)
      values.push(safeLimit, (parsedPage - 1) * safeLimit)
      pagination = 'LIMIT $1 OFFSET $2'
    }

    const result = await query(
      `SELECT id, title, summary, content, category, image, published_at, created_at, updated_at
       FROM news
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
      `SELECT id, title, summary, content, category, image, published_at, created_at, updated_at
       FROM news
       WHERE id = $1`,
      [id]
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
      `INSERT INTO news (title, summary, content, category, image, published_at)
       VALUES ($1, $2, $3, $4, $5, COALESCE($6::date, CURRENT_DATE))
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
           published_at = $6::date,
           updated_at = NOW()
       WHERE id = $7`,
      [news.title, news.summary, news.content, news.category, news.image, news.publishedAt, id]
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
    const result = await query('DELETE FROM news WHERE id = $1', [id])

    if (result.rowCount === 0) {
      return reply.code(404).send({ status: 'NOT_FOUND', error: 'Noticia no encontrada.' })
    }

    return reply.code(200).send({ status: 'OK', message: 'Noticia eliminada correctamente.' })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'No se pudo eliminar la noticia.' })
  }
}
