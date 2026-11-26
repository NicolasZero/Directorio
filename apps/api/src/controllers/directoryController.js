import query, { withTransaction } from '../database/postgre.js'

const parseCoordinatePair = (latitude, longitude) => {
  const latitudeValue = latitude == null || String(latitude).trim() === '' ? null : Number(latitude)
  const longitudeValue = longitude == null || String(longitude).trim() === '' ? null : Number(longitude)

  if (latitudeValue === null && longitudeValue === null) {
    return { valid: true, latitude: null, longitude: null }
  }

  if (
    latitudeValue === null ||
    longitudeValue === null ||
    !Number.isFinite(latitudeValue) ||
    !Number.isFinite(longitudeValue) ||
    latitudeValue < -90 ||
    latitudeValue > 90 ||
    longitudeValue < -180 ||
    longitudeValue > 180
  ) {
    return { valid: false }
  }

  return { valid: true, latitude: latitudeValue, longitude: longitudeValue }
}

export const getDirectories = async (request, reply) => {
  const { estado, municipio, search, page, limit } = request.query || {}

  const conditions = []
  const values = []

  if (estado) {
    values.push(estado)
    conditions.push(`e.nombre = $${values.length}`)
  }

  if (municipio) {
    values.push(municipio)
    conditions.push(`m.nombre = $${values.length}`)
  }

  if (search) {
    values.push(`%${search}%`)
    conditions.push(`d.nombre ILIKE $${values.length}`)
  }

  conditions.push(`d.tipo_registro = 'DIRECTORIO'`)
  const parsedPage = parseInt(page, 10) || 1
  const parsedLimit = parseInt(limit, 10) || 9
  const offset = (parsedPage - 1) * parsedLimit

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  // Add limit and offset as parameters
  values.push(parsedLimit)
  const limitPlaceholder = `$${values.length}`
  values.push(offset)
  const offsetPlaceholder = `$${values.length}`

  try {
    const response = await query(
      `SELECT
          d.id,
          d.nombre,
          d.direccion,
          d.telefono,
          d.foto,
          d.correo,
          d.horario,
          m.nombre AS municipio,
          e.nombre AS estado
        FROM centros d
        JOIN municipios m ON m.id = d.municipio_id
        JOIN estados e ON e.id = m.estado_id
        ${whereClause}
        ORDER BY d.nombre
        LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}`,
      values
    )

    return reply.code(200).send({ status: 'OK', data: response.rows })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

export const getCountDirectory = async (request, reply) => {
  const { estado } = request.query || {}

  try {
    const response = await query(
      `WITH directorios AS (
         SELECT e.id AS estado_id, d.municipio_id, d.latitud, d.longitud, d.direccion
         FROM centros d
         JOIN municipios m ON m.id = d.municipio_id
         JOIN estados e ON e.id = m.estado_id
         WHERE d.tipo_registro = 'DIRECTORIO'
           AND ($1::varchar IS NULL OR e.nombre = $1)
       ),
       sedes AS (
         SELECT municipio_id, latitud, longitud, LOWER(BTRIM(direccion)) AS direccion
         FROM directorios
         WHERE latitud IS NOT NULL
           AND longitud IS NOT NULL
         GROUP BY municipio_id, latitud, longitud, LOWER(BTRIM(direccion))
       )
       SELECT
         (SELECT COUNT(*)::integer FROM directorios) AS total_defensoras,
         (SELECT COUNT(*)::integer FROM sedes) AS total_centros,
         COUNT(DISTINCT estado_id)::integer AS total_estados,
         COUNT(DISTINCT municipio_id)::integer AS total_municipios
       FROM directorios`,
      [estado || null]
    )
    return reply.code(200).send({ status: 'OK', data: response.rows[0] })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

export const getDirectoryStateCounts = async (request, reply) => {
  try {
    const response = await query(
      `SELECT
          e.nombre AS estado,
          COUNT(d.id)::integer AS total_directorios
        FROM estados e
        LEFT JOIN municipios m ON m.estado_id = e.id
        LEFT JOIN centros d
          ON d.municipio_id = m.id
          AND d.tipo_registro = 'DIRECTORIO'
        WHERE e.id <> 0
        GROUP BY e.id, e.nombre
        ORDER BY e.nombre`
    )

    return reply.code(200).send({ status: 'OK', data: response.rows })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

export const getDirectoryMunicipalities = async (request, reply) => {
  const { estado } = request.query || {}

  if (!estado) {
    return reply.code(400).send({ status: 'BAD_REQUEST', error: 'El estado es obligatorio' })
  }

  try {
    const response = await query(
      `SELECT DISTINCT m.nombre AS municipio
       FROM centros d
       JOIN municipios m ON m.id = d.municipio_id
       JOIN estados e ON e.id = m.estado_id
       WHERE d.tipo_registro = 'DIRECTORIO'
         AND e.nombre = $1
       ORDER BY m.nombre`,
      [estado]
    )

    return reply.code(200).send({
      status: 'OK',
      data: response.rows.map((row) => row.municipio),
    })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

export const getAllDirectories = async (request, reply) => {
  try {
    const count = await query(
      `SELECT
          COUNT(*) as total_centros
        FROM centros
        WHERE tipo_registro = 'DIRECTORIO'`
    )

    const response = await query(
      `SELECT
          d.id,
          d.nombre,
          d.descripcion,
          d.direccion,
          d.telefono,
          d.foto,
          d.correo,
          d.horario,
          m.nombre AS municipio,
          e.nombre AS estado
        FROM centros d
        JOIN municipios m ON m.id = d.municipio_id
        JOIN estados e ON e.id = m.estado_id
        WHERE d.tipo_registro = 'DIRECTORIO'
        ORDER BY d.nombre`
    )
    return reply.code(200).send({ status: 'OK', data: response.rows, count: count.rows[0].total_centros })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

export const getDirectoryById = async (request, reply) => {
  const { id } = request.params

  try {
    const response = await query(
      `SELECT
          d.id,
          d.nombre,
          d.descripcion,
          d.direccion,
          d.telefono,
          d.correo,
          d.foto,
          d.horario,
          d.latitud::double precision AS latitud,
          d.longitud::double precision AS longitud,
          m.nombre AS municipio,
          e.nombre AS estado,
          (
            SELECT json_agg(servicio ORDER BY created_at)
            FROM servicios_centro sd
            WHERE sd.centro_id = d.id
          ) AS servicios,
          (
            SELECT json_agg(jsonb_build_object('nombre', nombre, 'cargo', cargo) ORDER BY created_at)
            FROM responsables_centro rd
            WHERE rd.centro_id = d.id
          ) AS responsables,
          (
            SELECT json_agg(jsonb_build_object('nombre', nombre, 'url', url, 'icono', icono) ORDER BY created_at)
            FROM redes_centro rd
            WHERE rd.centro_id = d.id
          ) AS redes,
          (
            SELECT json_agg(requisito ORDER BY created_at)
            FROM requisitos_centro rd
            WHERE rd.centro_id = d.id
          ) AS requisitos
        FROM centros d
        JOIN municipios m ON m.id = d.municipio_id
        JOIN estados e ON e.id = m.estado_id
        WHERE d.id = $1
          AND d.tipo_registro = 'DIRECTORIO'`,
      [id]
    )

    if (response.rowCount === 0) {
      return reply.code(404).send({ status: 'NOT_FOUND', message: 'Directorio no encontrado' })
    }

    return reply.code(200).send({ status: 'OK', data: response.rows[0] })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

const insertRows = async (client, table, columns, rows) => {
  if (rows.length === 0) return

  const placeholders = rows.map((_, rowIndex) => {
    const values = columns.map((_, columnIndex) => `$${rowIndex * columns.length + columnIndex + 1}`)
    return `(${values.join(', ')})`
  })

  await client.query(
    `INSERT INTO ${table} (${columns.join(', ')}) VALUES ${placeholders.join(', ')}`,
    rows.flat()
  )
}

const insertDirectoryRelations = async (client, directoryId, { servicios, responsables, redes, requisitos }) => {
  await insertRows(
    client,
    'servicios_centro',
    ['centro_id', 'servicio'],
    servicios
      .filter((service) => typeof service === 'string' && service.trim())
      .map((service) => [directoryId, service.trim()])
  )
  await insertRows(
    client,
    'responsables_centro',
    ['centro_id', 'nombre', 'cargo'],
    responsables
      .filter((responsable) =>
        typeof responsable?.nombre === 'string' &&
        responsable.nombre.trim() &&
        typeof responsable?.cargo === 'string' &&
        responsable.cargo.trim()
      )
      .map((responsable) => [directoryId, responsable.nombre.trim(), responsable.cargo.trim()])
  )
  await insertRows(
    client,
    'redes_centro',
    ['centro_id', 'nombre', 'url', 'icono'],
    redes
      .filter((red) =>
        typeof red?.nombre === 'string' &&
        red.nombre.trim() &&
        typeof red?.url === 'string' &&
        red.url.trim()
      )
      .map((red) => [
        directoryId,
        red.nombre.trim(),
        red.url.trim(),
        typeof red.icono === 'string' && red.icono.trim() ? red.icono.trim() : null,
      ])
  )
  await insertRows(
    client,
    'requisitos_centro',
    ['centro_id', 'requisito'],
    requisitos
      .filter((requirement) => typeof requirement === 'string' && requirement.trim())
      .map((requirement) => [directoryId, requirement.trim()])
  )
}

export const createDirectory = async (request, reply) => {
  const {
    nombre,
    descripcion,
    direccion,
    telefono,
    correo,
    foto,
    horario,
    latitud,
    longitud,
    estado,
    municipio,
    servicios = [],
    responsables = [],
    redes = [],
    requisitos = []
  } = request.body

  // Validación básica
  if (!nombre || !direccion || !telefono || !estado || !municipio) {
    return reply.code(400).send({ status: 'BAD_REQUEST', error: 'Campos obligatorios faltantes' })
  }

  const coordinates = parseCoordinatePair(latitud, longitud)
  if (!coordinates.valid) {
    return reply.code(400).send({
      status: 'BAD_REQUEST',
      error: 'Indica latitud y longitud válidas, o deja ambos campos vacíos'
    })
  }

  try {
    const locationIds = await getLocationIds(estado, municipio)
    if (!locationIds) {
      return reply.code(400).send({ status: 'BAD_REQUEST', error: 'Estado o municipio no encontrado' })
    }

    const directoryId = await withTransaction(async (client) => {
      const directoryResult = await client.query(
        `INSERT INTO centros (
           tipo_registro, fuente, fuente_id, nombre, descripcion, direccion, telefono,
           correo, foto, estado_id, municipio_id, latitud, longitud, horario
         )
         VALUES ('DIRECTORIO', 'ADMIN', NULL, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id`,
        [
          nombre, descripcion, direccion, telefono, correo, foto,
          locationIds.estado_id, locationIds.municipio_id,
          coordinates.latitude, coordinates.longitude, horario
        ]
      )

      const id = directoryResult.rows[0].id
      await insertDirectoryRelations(client, id, { servicios, responsables, redes, requisitos })
      return id
    })

    return reply.code(201).send({ status: 'CREATED', message: 'Directorio creado exitosamente', id: directoryId })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

const getLocationIds = async (estado, municipio) => {
  const response = await query(
    `SELECT m.id as municipio_id, e.id as estado_id
     FROM municipios m
     JOIN estados e ON e.id = m.estado_id
     WHERE e.nombre = $1 AND m.nombre = $2`,
    [estado, municipio]
  )

  if (response.rowCount === 0) {
    return null
  }

  return response.rows[0]
}

export const updateDirectory = async (request, reply) => {
  const { id } = request.params
  const {
    nombre,
    descripcion,
    direccion,
    telefono,
    correo,
    foto,
    horario,
    latitud,
    longitud,
    estado,
    municipio,
    servicios = [],
    responsables = [],
    redes = [],
    requisitos = []
  } = request.body

  if (!nombre || !direccion || !telefono || !estado || !municipio) {
    return reply.code(400).send({ status: 'BAD_REQUEST', error: 'Campos obligatorios faltantes' })
  }

  const coordinates = parseCoordinatePair(latitud, longitud)
  if (!coordinates.valid) {
    return reply.code(400).send({
      status: 'BAD_REQUEST',
      error: 'Indica latitud y longitud válidas, o deja ambos campos vacíos'
    })
  }

  try {
    const locationIds = await getLocationIds(estado, municipio)
    if (!locationIds) {
      return reply.code(400).send({ status: 'BAD_REQUEST', error: 'Estado o municipio no encontrado' })
    }

    const updated = await withTransaction(async (client) => {
      const updateResult = await client.query(
        `UPDATE centros
         SET nombre = $1,
             descripcion = $2,
             direccion = $3,
             telefono = $4,
             correo = $5,
             foto = $6,
             horario = $7,
             estado_id = $8,
             municipio_id = $9,
             latitud = $10,
             longitud = $11
         WHERE id = $12
           AND tipo_registro = 'DIRECTORIO'`,
        [
          nombre, descripcion, direccion, telefono, correo, foto, horario,
          locationIds.estado_id, locationIds.municipio_id,
          coordinates.latitude, coordinates.longitude, id
        ]
      )

      if (updateResult.rowCount === 0) return false

      await client.query('DELETE FROM servicios_centro WHERE centro_id = $1', [id])
      await client.query('DELETE FROM responsables_centro WHERE centro_id = $1', [id])
      await client.query('DELETE FROM redes_centro WHERE centro_id = $1', [id])
      await client.query('DELETE FROM requisitos_centro WHERE centro_id = $1', [id])
      await insertDirectoryRelations(client, id, { servicios, responsables, redes, requisitos })
      return true
    })

    if (!updated) {
      return reply.code(404).send({ status: 'NOT_FOUND', error: 'Directorio no encontrado' })
    }
    return reply.code(200).send({ status: 'OK', message: 'Directorio actualizado exitosamente' })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

export const deleteDirectory = async (request, reply) => {
  const { id } = request.params

  try {
    const deleted = await withTransaction(async (client) => {
      const directoryResult = await client.query(
        `SELECT id
         FROM centros
         WHERE id = $1 AND tipo_registro = 'DIRECTORIO'
         FOR UPDATE`,
        [id]
      )
      if (directoryResult.rowCount === 0) return false

      await client.query('DELETE FROM servicios_centro WHERE centro_id = $1', [id])
      await client.query('DELETE FROM responsables_centro WHERE centro_id = $1', [id])
      await client.query('DELETE FROM redes_centro WHERE centro_id = $1', [id])
      await client.query('DELETE FROM requisitos_centro WHERE centro_id = $1', [id])

      const deleteResult = await client.query(
        `DELETE FROM centros
         WHERE id = $1 AND tipo_registro = 'DIRECTORIO'`,
        [id]
      )
      return deleteResult.rowCount > 0
    })

    if (!deleted) {
      return reply.code(404).send({ status: 'NOT_FOUND', error: 'Directorio no encontrado' })
    }

    return reply.code(200).send({ status: 'OK', message: 'Directorio eliminado exitosamente' })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}
