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

const normalizeText = (value) => String(value ?? '').trim()

// ============================================================
// PUBLICO: listado paginado de defensoras (vista directorio)
// ============================================================
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
    conditions.push(`c.nombre ILIKE $${values.length}`)
  }

  conditions.push(`c.tipo_registro = 'DIRECTORIO'`, 'c.eliminado = false')
  const parsedPage = parseInt(page, 10) || 1
  const parsedLimit = parseInt(limit, 10) || 9
  const offset = (parsedPage - 1) * parsedLimit

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  values.push(parsedLimit)
  const limitPlaceholder = `$${values.length}`
  values.push(offset)
  const offsetPlaceholder = `$${values.length}`

  try {
    const response = await query(
      `SELECT
          c.id,
          c.nombre,
          c.descripcion,
          c.organismo,
          c.direccion,
          d.telefono,
          d.correo,
          c.foto,
          c.foto2,
          c.horario,
          c.parroquia_id,
          p.nombre AS parroquia,
          m.nombre AS municipio,
          e.nombre AS estado,
          c.latitud::double precision AS latitud,
          c.longitud::double precision AS longitud
        FROM defensoras d
        JOIN centros c ON c.id = d.centro_id
        JOIN municipios m ON m.id = c.municipio_id
        JOIN estados e ON e.id = m.estado_id
        LEFT JOIN parroquias p ON p.id = c.parroquia_id
        ${whereClause}
        ORDER BY c.nombre, d.id
        LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}`,
      values
    )

    return reply.code(200).send({ status: 'OK', data: response.rows })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

// ============================================================
// PUBLICO: conteos del directorio
// ============================================================
export const getCountDirectory = async (request, reply) => {
  const { estado } = request.query || {}

  try {
    const response = await query(
      `WITH directorios AS (
         SELECT e.id AS estado_id, c.municipio_id, c.latitud, c.longitud, c.direccion
         FROM centros c
         JOIN municipios m ON m.id = c.municipio_id
         JOIN estados e ON e.id = m.estado_id
         WHERE c.tipo_registro = 'DIRECTORIO'
           AND c.eliminado = false
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

// ============================================================
// PUBLICO: totales por estado (tarjetas del directorio publico)
// ============================================================
export const getDirectoryStateCounts = async (request, reply) => {
  try {
    const response = await query(
      `SELECT
          e.nombre AS estado,
          COUNT(d.id)::integer AS total_directorios
        FROM estados e
        LEFT JOIN municipios m ON m.estado_id = e.id
        LEFT JOIN centros c
          ON c.municipio_id = m.id
          AND c.tipo_registro = 'DIRECTORIO'
          AND c.eliminado = false
        LEFT JOIN defensoras d ON d.centro_id = c.id
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

// ============================================================
// PUBLICO: municipios con centros por estado
// ============================================================
export const getDirectoryMunicipalities = async (request, reply) => {
  const { estado } = request.query || {}

  if (!estado) {
    return reply.code(400).send({ status: 'BAD_REQUEST', error: 'El estado es obligatorio' })
  }

  try {
    const response = await query(
      `SELECT DISTINCT m.nombre AS municipio
       FROM centros c
       JOIN municipios m ON m.id = c.municipio_id
       JOIN estados e ON e.id = m.estado_id
       WHERE c.tipo_registro = 'DIRECTORIO'
         AND c.eliminado = false
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

// ============================================================
// ADMIN: centros agrupados por organismo, con filtros de
// estado / municipio / parroquia y paginado de 10
// ============================================================
export const getAdminCenters = async (request, reply) => {
  const { estado, municipio, parroquia, page, limit } = request.query || {}

  const conditions = ["c.tipo_registro = 'DIRECTORIO'", 'c.eliminado = false']
  const values = []

  if (estado) {
    values.push(estado)
    conditions.push(`e.nombre = $${values.length}`)
  }

  if (municipio) {
    values.push(municipio)
    conditions.push(`m.nombre = $${values.length}`)
  }

  if (parroquia) {
    values.push(parroquia)
    conditions.push(`p.nombre = $${values.length}`)
  }

  const parsedPage = parseInt(page, 10) || 1
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100)
  const offset = (parsedPage - 1) * parsedLimit

  const whereClause = `WHERE ${conditions.join(' AND ')}`

  values.push(parsedLimit)
  const limitPlaceholder = `$${values.length}`
  values.push(offset)
  const offsetPlaceholder = `$${values.length}`

  try {
    const countResult = await query(
      `SELECT COUNT(*)::integer AS total
       FROM (
         SELECT c.id
         FROM centros c
         JOIN municipios m ON m.id = c.municipio_id
         JOIN estados e ON e.id = m.estado_id
         LEFT JOIN parroquias p ON p.id = c.parroquia_id
         ${whereClause}
         GROUP BY c.id
       ) t`,
      values.slice(0, values.length - 2)
    )

    const response = await query(
      `SELECT
          c.id,
          c.nombre,
          COALESCE(NULLIF(BTRIM(c.organismo), ''), c.nombre) AS organismo,
          c.direccion,
          c.descripcion,
          c.foto,
          c.foto2,
          c.horario,
          c.parroquia_id,
          p.nombre AS parroquia,
          m.nombre AS municipio,
          e.nombre AS estado,
          c.latitud::double precision AS latitud,
          c.longitud::double precision AS longitud,
          (
            SELECT json_agg(
              jsonb_build_object('id', d.id, 'correo', d.correo, 'telefono', d.telefono)
              ORDER BY d.id
            )
            FROM defensoras d
            WHERE d.centro_id = c.id AND d.eliminado = false
          ) AS defensoras
        FROM (
          SELECT DISTINCT ON (COALESCE(NULLIF(BTRIM(c2.organismo), ''), c2.nombre), c2.estado_id, c2.municipio_id, c2.parroquia_id)
            c2.id
          FROM centros c2
          WHERE c2.tipo_registro = 'DIRECTORIO' AND c2.eliminado = false
          ORDER BY COALESCE(NULLIF(BTRIM(c2.organismo), ''), c2.nombre), c2.estado_id, c2.municipio_id, c2.parroquia_id, c2.id
        ) representante
        JOIN centros c ON c.id = representante.id
        JOIN municipios m ON m.id = c.municipio_id
        JOIN estados e ON e.id = m.estado_id
        LEFT JOIN parroquias p ON p.id = c.parroquia_id
        ${whereClause}
        ORDER BY c.nombre, c.id
        LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}`,
      values
    )

    return reply.code(200).send({
      status: 'OK',
      data: response.rows,
      count: countResult.rows[0]?.total ?? 0,
      page: parsedPage,
      limit: parsedLimit,
    })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

// ============================================================
// ADMIN: opciones de filtro — solo estados/municipios/parroquias
// con centros activos
// ============================================================
export const getAdminFilters = async (request, reply) => {
  const { estado, municipio } = request.query || {}
  const values = []

  try {
    let estadosResult
    let municipiosResult
    let parroquiasResult

    if (estado && municipio) {
      // Parroquias con centros en ese estado+municipio
      values.push(estado, municipio)
      parroquiasResult = await query(
        `SELECT DISTINCT p.nombre
         FROM centros c
         JOIN municipios m ON m.id = c.municipio_id
         JOIN estados e ON e.id = m.estado_id
         LEFT JOIN parroquias p ON p.id = c.parroquia_id
         WHERE c.tipo_registro = 'DIRECTORIO'
           AND c.eliminado = false
           AND e.nombre = $1
           AND m.nombre = $2
           AND p.nombre IS NOT NULL
         ORDER BY p.nombre`,
        values
      )

      municipiosResult = await query(
        `SELECT DISTINCT m.nombre
         FROM centros c
         JOIN municipios m ON m.id = c.municipio_id
         JOIN estados e ON e.id = m.estado_id
         WHERE c.tipo_registro = 'DIRECTORIO'
           AND c.eliminado = false
           AND e.nombre = $1
         ORDER BY m.nombre`,
        [estado]
      )

      estadosResult = await query(
        `SELECT DISTINCT e.nombre
         FROM centros c
         JOIN municipios m ON m.id = c.municipio_id
         JOIN estados e ON e.id = m.estado_id
         WHERE c.tipo_registro = 'DIRECTORIO' AND c.eliminado = false
         ORDER BY e.nombre`
      )
    } else if (estado) {
      values.push(estado)
      municipiosResult = await query(
        `SELECT DISTINCT m.nombre
         FROM centros c
         JOIN municipios m ON m.id = c.municipio_id
         JOIN estados e ON e.id = m.estado_id
         WHERE c.tipo_registro = 'DIRECTORIO'
           AND c.eliminado = false
           AND e.nombre = $1
         ORDER BY m.nombre`,
        values
      )
      estadosResult = await query(
        `SELECT DISTINCT e.nombre
         FROM centros c
         JOIN municipios m ON m.id = c.municipio_id
         JOIN estados e ON e.id = m.estado_id
         WHERE c.tipo_registro = 'DIRECTORIO' AND c.eliminado = false
         ORDER BY e.nombre`
      )
      parroquiasResult = { rows: [] }
    } else {
      estadosResult = await query(
        `SELECT DISTINCT e.nombre
         FROM centros c
         JOIN municipios m ON m.id = c.municipio_id
         JOIN estados e ON e.id = m.estado_id
         WHERE c.tipo_registro = 'DIRECTORIO' AND c.eliminado = false
         ORDER BY e.nombre`
      )
      municipiosResult = { rows: [] }
      parroquiasResult = { rows: [] }
    }

    return reply.code(200).send({
      status: 'OK',
      data: {
        estados: estadosResult.rows.map((r) => r.nombre),
        municipios: municipiosResult.rows.map((r) => r.nombre),
        parroquias: parroquiasResult.rows.map((r) => r.nombre),
      },
    })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

// ============================================================
// ADMIN: detalle agrupado de un centro (organismo + defensoras)
// ============================================================
export const getAdminCenterById = async (request, reply) => {
  const { id } = request.params

  try {
    const centerResult = await query(
      `SELECT
          c.id,
          c.nombre,
          COALESCE(NULLIF(BTRIM(c.organismo), ''), c.nombre) AS organismo,
          c.descripcion,
          c.direccion,
          c.foto,
          c.foto2,
          c.horario,
          c.parroquia_id,
          p.nombre AS parroquia,
          m.nombre AS municipio,
          e.nombre AS estado,
          c.latitud::double precision AS latitud,
          c.longitud::double precision AS longitud,
          (
            SELECT json_agg(
              jsonb_build_object('id', d.id, 'correo', d.correo, 'telefono', d.telefono)
              ORDER BY d.id
            )
            FROM defensoras d
            WHERE d.centro_id = c.id AND d.eliminado = false
          ) AS defensoras,
          (
            SELECT json_agg(servicio ORDER BY created_at)
            FROM servicios_centro sd
            WHERE sd.centro_id = c.id
          ) AS servicios,
          (
            SELECT json_agg(jsonb_build_object('nombre', nombre, 'cargo', cargo) ORDER BY created_at)
            FROM responsables_centro rd
            WHERE rd.centro_id = c.id
          ) AS responsables,
          (
            SELECT json_agg(jsonb_build_object('nombre', nombre, 'url', url, 'icono', icono) ORDER BY created_at)
            FROM redes_centro rd
            WHERE rd.centro_id = c.id
          ) AS redes,
          (
            SELECT json_agg(requisito ORDER BY created_at)
            FROM requisitos_centro rd
            WHERE rd.centro_id = c.id
          ) AS requisitos
        FROM centros c
        JOIN municipios m ON m.id = c.municipio_id
        JOIN estados e ON e.id = m.estado_id
        LEFT JOIN parroquias p ON p.id = c.parroquia_id
        WHERE c.id = $1
          AND c.tipo_registro = 'DIRECTORIO'`,
      [id]
    )

    if (centerResult.rowCount === 0) {
      return reply.code(404).send({ status: 'NOT_FOUND', error: 'Centro no encontrado' })
    }

    // IDs de todos los registros DIRECTORIO del mismo organismo en la misma ubicación
    const center = centerResult.rows[0]
    const siblingResult = await query(
      `SELECT c2.id
       FROM centros c2
       JOIN centros c3 ON c3.id = $1
       WHERE c2.tipo_registro = 'DIRECTORIO'
         AND c2.eliminado = false
         AND COALESCE(NULLIF(BTRIM(c2.organismo), ''), c2.nombre) = COALESCE(NULLIF(BTRIM(c3.organismo), ''), c3.nombre)
         AND c2.municipio_id = c3.municipio_id
         AND COALESCE(c2.parroquia_id, 0) = COALESCE(c3.parroquia_id, 0)`,
      [id]
    )

    return reply.code(200).send({
      status: 'OK',
      data: center,
      siblingIds: siblingResult.rows.map((r) => r.id),
    })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

// ============================================================
// Utilidades de ubicación
// ============================================================
const getLocationIds = async (client, estado, municipio, parroquia) => {
  const response = await client.query(
    `SELECT m.id as municipio_id, e.id as estado_id, p.id as parroquia_id
     FROM municipios m
     JOIN estados e ON e.id = m.estado_id
     LEFT JOIN parroquias p ON p.municipio_id = m.id AND p.nombre = $3
     WHERE e.nombre = $1 AND m.nombre = $2`,
    [estado, municipio, parroquia || null]
  )

  if (response.rowCount === 0) {
    return null
  }

  return response.rows[0]
}

const ensureParroquia = async (client, municipioId, parroquia) => {
  const name = normalizeText(parroquia)
  if (!name) return null

  const existing = await client.query(
    'SELECT id FROM parroquias WHERE municipio_id = $1 AND nombre = $2',
    [municipioId, name]
  )
  if (existing.rowCount > 0) return existing.rows[0].id

  const created = await client.query(
    'INSERT INTO parroquias (nombre, municipio_id) VALUES ($1, $2) RETURNING id',
    [name, municipioId]
  )
  return created.rows[0].id
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

// ============================================================
// Validación de duplicados antes de crear
// ============================================================
export const checkCenterDuplicate = async (request, reply) => {
  const { correo, telefono } = request.body || {}

  try {
    const email = normalizeText(correo).toLowerCase()
    const phone = normalizeText(telefono).replace(/\D/g, '')

    if (!email && !phone) {
      return reply.code(400).send({
        status: 'BAD_REQUEST',
        error: 'Proporciona correo o teléfono para validar duplicados',
      })
    }

    // Buscar duplicado por correo en defensoras activas
    if (email) {
      const emailResult = await query(
        `SELECT
            d.correo,
            COALESCE(NULLIF(BTRIM(c.organismo), ''), c.nombre) AS organismo
          FROM defensoras d
          JOIN centros c ON c.id = d.centro_id
          WHERE d.eliminado = false
            AND c.eliminado = false
            AND LOWER(TRIM(d.correo)) = $1
          LIMIT 1`,
        [email]
      )
      if (emailResult.rowCount > 0) {
        return reply.code(200).send({
          status: 'OK',
          duplicado: true,
          tipo: 'defensora',
          mensaje: `Esta defensora ya está registrada en el centro: ${emailResult.rows[0].organismo}`,
        })
      }
    }

    // Buscar duplicado por teléfono en defensoras activas
    if (phone) {
      const phoneResult = await query(
        `SELECT
            d.telefono,
            COALESCE(NULLIF(BTRIM(c.organismo), ''), c.nombre) AS organismo
          FROM defensoras d
          JOIN centros c ON c.id = d.centro_id
          WHERE d.eliminado = false
            AND c.eliminado = false
            AND REGEXP_REPLACE(COALESCE(d.telefono, ''), '\\D', '', 'g') = $1
          LIMIT 1`,
        [phone]
      )
      if (phoneResult.rowCount > 0) {
        return reply.code(200).send({
          status: 'OK',
          duplicado: true,
          tipo: 'defensora',
          mensaje: `Esta defensora ya está registrada en el centro: ${phoneResult.rows[0].organismo}`,
        })
      }
    }

    return reply.code(200).send({ status: 'OK', duplicado: false })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

// ============================================================
// ADMIN: crear centro (agrupado por organismo + defensoras)
// ============================================================
export const createAdminCenter = async (request, reply) => {
  const {
    nombre,
    organismo,
    descripcion,
    direccion,
    foto,
    foto2,
    horario,
    latitud,
    longitud,
    estado,
    municipio,
    parroquia,
    servicios = [],
    responsables = [],
    redes = [],
    requisitos = [],
    defensoras = [],
  } = request.body

  const centerName = normalizeText(nombre) || 'GERENCIA DE LA DEFENSORA NACIONAL DE LOS DERECHOS DE LA MUJER'
  const organism = normalizeText(organismo)

  if (!organism || !direccion || !estado || !municipio) {
    return reply.code(400).send({
      status: 'BAD_REQUEST',
      error: 'Organismo, dirección, estado y municipio son obligatorios',
    })
  }

  const coordinates = parseCoordinatePair(latitud, longitud)
  if (!coordinates.valid) {
    return reply.code(400).send({
      status: 'BAD_REQUEST',
      error: 'Indica latitud y longitud válidas, o deja ambos campos vacíos',
    })
  }

  // Validar duplicados de defensoras antes de insertar
  const duplicateErrors = []
  for (const defensora of defensoras) {
    const email = normalizeText(defensora?.correo).toLowerCase()
    const phoneDigits = normalizeText(defensora?.telefono).replace(/\D/g, '')

    if (email) {
      const found = await query(
        `SELECT COALESCE(NULLIF(BTRIM(c.organismo), ''), c.nombre) AS organismo
         FROM defensoras d
         JOIN centros c ON c.id = d.centro_id
         WHERE d.eliminado = false AND c.eliminado = false
           AND LOWER(TRIM(d.correo)) = $1
         LIMIT 1`,
        [email]
      )
      if (found.rowCount > 0) {
        duplicateErrors.push(`La defensora con correo ${email} ya está registrada en ${found.rows[0].organismo}`)
      }
    }

    if (!email && phoneDigits) {
      const found = await query(
        `SELECT COALESCE(NULLIF(BTRIM(c.organismo), ''), c.nombre) AS organismo
         FROM defensoras d
         JOIN centros c ON c.id = d.centro_id
         WHERE d.eliminado = false AND c.eliminado = false
           AND REGEXP_REPLACE(COALESCE(d.telefono, ''), '\\D', '', 'g') = $1
         LIMIT 1`,
        [phoneDigits]
      )
      if (found.rowCount > 0) {
        duplicateErrors.push(`La defensora con teléfono ${defensora.telefono} ya está registrada en ${found.rows[0].organismo}`)
      }
    }
  }

  if (duplicateErrors.length > 0) {
    return reply.code(409).send({
      status: 'CONFLICT',
      error: duplicateErrors.join(' | '),
    })
  }

  try {
    const centerId = await withTransaction(async (client) => {
      const locationIds = await getLocationIds(client, estado, municipio, parroquia)
      if (!locationIds) {
        throw new Error('Estado o municipio no encontrado')
      }

      const parroquiaId = await ensureParroquia(client, locationIds.municipio_id, parroquia)

      // Buscar si ya existe un centro con el mismo organismo y ubicación
      const existing = await client.query(
        `SELECT c.id
         FROM centros c
         WHERE c.tipo_registro = 'DIRECTORIO'
           AND c.eliminado = false
           AND COALESCE(NULLIF(BTRIM(c.organismo), ''), c.nombre) = $1
           AND c.municipio_id = $2
           AND COALESCE(c.parroquia_id, 0) = COALESCE($3, 0)
         LIMIT 1`,
        [organism, locationIds.municipio_id, parroquiaId]
      )

      let targetId
      if (existing.rowCount > 0) {
        // Agrupar al centro existente: actualizar datos y agregar defensoras
        targetId = existing.rows[0].id
        await client.query(
          `UPDATE centros
           SET nombre = $1,
               descripcion = COALESCE(NULLIF($2, ''), descripcion),
               direccion = $3,
               foto = COALESCE(NULLIF($4, ''), foto),
               foto2 = COALESCE(NULLIF($5, ''), foto2),
               horario = COALESCE(NULLIF($6, ''), horario),
               latitud = COALESCE($7, latitud),
               longitud = COALESCE($8, longitud),
               parroquia_id = COALESCE($9, parroquia_id)
           WHERE id = $10`,
          [centerName, descripcion, direccion, foto, foto2, horario,
            coordinates.latitude, coordinates.longitude, parroquiaId, targetId]
        )
      } else {
        const inserted = await client.query(
          `INSERT INTO centros (
             tipo_registro, fuente, fuente_id, nombre, descripcion, organismo,
             direccion, foto, foto2, estado_id, municipio_id, parroquia_id,
             latitud, longitud, horario
           )
           VALUES ('DIRECTORIO', 'ADMIN', NULL, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           RETURNING id`,
          [
            centerName, descripcion, organism, direccion, foto, foto2,
            locationIds.estado_id, locationIds.municipio_id, parroquiaId,
            coordinates.latitude, coordinates.longitude, horario,
          ]
        )
        targetId = inserted.rows[0].id
      }

      // Insertar defensoras
      const validDefensoras = defensoras
        .filter((defensora) =>
          (typeof defensora?.correo === 'string' && defensora.correo.trim()) ||
          (typeof defensora?.telefono === 'string' && defensora.telefono.trim())
        )
        .map((defensora) => [
          targetId,
          normalizeText(defensora.correo) || null,
          normalizeText(defensora.telefono) || null,
        ])

      if (validDefensoras.length > 0) {
        const placeholders = validDefensoras.map((_, i) =>
          `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`
        ).join(', ')
        await client.query(
          `INSERT INTO defensoras (centro_id, correo, telefono) VALUES ${placeholders}`,
          validDefensoras.flat()
        )
      }

      // Relaciones del centro
      await insertDirectoryRelations(client, targetId, { servicios, responsables, redes, requisitos })
      return targetId
    })

    return reply.code(201).send({
      status: 'CREATED',
      message: 'Centro registrado exitosamente',
      id: centerId,
    })
  } catch (error) {
    if (error.message === 'Estado o municipio no encontrado') {
      return reply.code(400).send({ status: 'BAD_REQUEST', error: error.message })
    }
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

// ============================================================
// ADMIN: actualizar centro agrupado (con defensoras y creación
// de nuevas defensoras)
// ============================================================
export const updateAdminCenter = async (request, reply) => {
  const { id } = request.params
  const {
    nombre,
    organismo,
    descripcion,
    direccion,
    foto,
    foto2,
    horario,
    latitud,
    longitud,
    estado,
    municipio,
    parroquia,
    servicios = [],
    responsables = [],
    redes = [],
    requisitos = [],
    defensoras = [],
    defensorasEliminadas = [],
  } = request.body

  const centerName = normalizeText(nombre) || 'GERENCIA DE LA DEFENSORA NACIONAL DE LOS DERECHOS DE LA MUJER'
  const organism = normalizeText(organismo)

  if (!organism || !direccion || !estado || !municipio) {
    return reply.code(400).send({
      status: 'BAD_REQUEST',
      error: 'Organismo, dirección, estado y municipio son obligatorios',
    })
  }

  const coordinates = parseCoordinatePair(latitud, longitud)
  if (!coordinates.valid) {
    return reply.code(400).send({
      status: 'BAD_REQUEST',
      error: 'Indica latitud y longitud válidas, o deja ambos campos vacíos',
    })
  }

  // Validar duplicados solo en defensoras nuevas (sin id o con id=0)
  const duplicateErrors = []
  for (const defensora of defensoras) {
    const isNew = !defensora?.id
    if (!isNew) continue

    const email = normalizeText(defensora?.correo).toLowerCase()
    const phoneDigits = normalizeText(defensora?.telefono).replace(/\D/g, '')

    if (email) {
      const found = await query(
        `SELECT COALESCE(NULLIF(BTRIM(c.organismo), ''), c.nombre) AS organismo
         FROM defensoras d
         JOIN centros c ON c.id = d.centro_id
         WHERE d.eliminado = false AND c.eliminado = false
           AND LOWER(TRIM(d.correo)) = $1
         LIMIT 1`,
        [email]
      )
      if (found.rowCount > 0) {
        duplicateErrors.push(`La defensora con correo ${email} ya está registrada en ${found.rows[0].organismo}`)
      }
    }

    if (!email && phoneDigits) {
      const found = await query(
        `SELECT COALESCE(NULLIF(BTRIM(c.organismo), ''), c.nombre) AS organismo
         FROM defensoras d
         JOIN centros c ON c.id = d.centro_id
         WHERE d.eliminado = false AND c.eliminado = false
           AND REGEXP_REPLACE(COALESCE(d.telefono, ''), '\\D', '', 'g') = $1
         LIMIT 1`,
        [phoneDigits]
      )
      if (found.rowCount > 0) {
        duplicateErrors.push(`La defensora con teléfono ${defensora.telefono} ya está registrada en ${found.rows[0].organismo}`)
      }
    }
  }

  if (duplicateErrors.length > 0) {
    return reply.code(409).send({
      status: 'CONFLICT',
      error: duplicateErrors.join(' | '),
    })
  }

  try {
    const updated = await withTransaction(async (client) => {
      const locationIds = await getLocationIds(client, estado, municipio, parroquia)
      if (!locationIds) {
        throw new Error('Estado o municipio no encontrado')
      }

      const parroquiaId = await ensureParroquia(client, locationIds.municipio_id, parroquia)

      const updateResult = await client.query(
        `UPDATE centros
         SET nombre = $1,
             descripcion = $2,
             organismo = $3,
             direccion = $4,
             foto = $5,
             foto2 = $6,
             horario = $7,
             estado_id = $8,
             municipio_id = $9,
             parroquia_id = $10,
             latitud = $11,
             longitud = $12
         WHERE id = $13
           AND tipo_registro = 'DIRECTORIO'
           AND eliminado = false
         RETURNING id`,
        [
          centerName, descripcion, organism, direccion, foto, foto2, horario,
          locationIds.estado_id, locationIds.municipio_id, parroquiaId,
          coordinates.latitude, coordinates.longitude, id,
        ]
      )

      if (updateResult.rowCount === 0) return false

      // Soft-delete de defensoras marcadas como eliminadas
      if (Array.isArray(defensorasEliminadas) && defensorasEliminadas.length > 0) {
        await client.query(
          `UPDATE defensoras
           SET eliminado = true, eliminado_en = NOW()
           WHERE id = ANY($1::int[]) AND centro_id = $2`,
          [defensorasEliminadas, id]
        )
      }

      // Insertar defensoras nuevas
      const newDefensoras = defensoras
        .filter((defensora) => !defensora?.id)
        .filter((defensora) =>
          (typeof defensora?.correo === 'string' && defensora.correo.trim()) ||
          (typeof defensora?.telefono === 'string' && defensora.telefono.trim())
        )
        .map((defensora) => [
          id,
          normalizeText(defensora.correo) || null,
          normalizeText(defensora.telefono) || null,
        ])

      if (newDefensoras.length > 0) {
        const placeholders = newDefensoras.map((_, i) =>
          `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`
        ).join(', ')
        await client.query(
          `INSERT INTO defensoras (centro_id, correo, telefono) VALUES ${placeholders}`,
          newDefensoras.flat()
        )
      }

      // Actualizar datos de contacto de defensoras existentes
      for (const defensora of defensoras) {
        if (!defensora?.id) continue
        await client.query(
          `UPDATE defensoras
           SET correo = $1, telefono = $2
           WHERE id = $3 AND centro_id = $4 AND eliminado = false`,
          [
            normalizeText(defensora.correo) || null,
            normalizeText(defensora.telefono) || null,
            defensora.id,
            id,
          ]
        )
      }

      // Relaciones del centro: reemplazar
      await client.query('DELETE FROM servicios_centro WHERE centro_id = $1', [id])
      await client.query('DELETE FROM responsables_centro WHERE centro_id = $1', [id])
      await client.query('DELETE FROM redes_centro WHERE centro_id = $1', [id])
      await client.query('DELETE FROM requisitos_centro WHERE centro_id = $1', [id])
      await insertDirectoryRelations(client, id, { servicios, responsables, redes, requisitos })
      return true
    })

    if (!updated) {
      return reply.code(404).send({ status: 'NOT_FOUND', error: 'Centro no encontrado' })
    }
    return reply.code(200).send({ status: 'OK', message: 'Centro actualizado exitosamente' })
  } catch (error) {
    if (error.message === 'Estado o municipio no encontrado') {
      return reply.code(400).send({ status: 'BAD_REQUEST', error: error.message })
    }
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

// ============================================================
// ADMIN: soft-delete del centro (se mantiene en la BD con fecha)
// ============================================================
export const deleteAdminCenter = async (request, reply) => {
  const { id } = request.params

  try {
    const result = await withTransaction(async (client) => {
      const deleteResult = await client.query(
        `UPDATE centros
         SET eliminado = true, eliminado_en = NOW()
         WHERE id = $1
           AND tipo_registro = 'DIRECTORIO'
           AND eliminado = false
         RETURNING id`,
        [id]
      )
      return deleteResult.rowCount > 0
    })

    if (!result) {
      return reply.code(404).send({ status: 'NOT_FOUND', error: 'Centro no encontrado' })
    }

    return reply.code(200).send({
      status: 'OK',
      message: 'Centro bloqueado (eliminado lógico) correctamente',
    })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

// ============================================================
// PUBLICO: detalle del centro (usa la vista vw_directorio_detalle
// pero con join directo para respetar el soft-delete)
// ============================================================
export const getDirectoryById = async (request, reply) => {
  const { id } = request.params

  try {
    const response = await query(
      `SELECT
          c.id,
          c.nombre,
          COALESCE(NULLIF(BTRIM(c.organismo), ''), c.nombre) AS organismo,
          c.descripcion,
          c.direccion,
          c.foto,
          c.foto2,
          c.horario,
          c.parroquia_id,
          p.nombre AS parroquia,
          m.nombre AS municipio,
          e.nombre AS estado,
          c.latitud::double precision AS latitud,
          c.longitud::double precision AS longitud,
          (
            SELECT json_agg(
              jsonb_build_object('id', d.id, 'correo', d.correo, 'telefono', d.telefono)
              ORDER BY d.id
            )
            FROM defensoras d
            WHERE d.centro_id = c.id AND d.eliminado = false
          ) AS defensoras,
          (
            SELECT json_agg(servicio ORDER BY created_at)
            FROM servicios_centro sd
            WHERE sd.centro_id = c.id
          ) AS servicios,
          (
            SELECT json_agg(jsonb_build_object('nombre', nombre, 'cargo', cargo) ORDER BY created_at)
            FROM responsables_centro rd
            WHERE rd.centro_id = c.id
          ) AS responsables,
          (
            SELECT json_agg(jsonb_build_object('nombre', nombre, 'url', url, 'icono', icono) ORDER BY created_at)
            FROM redes_centro rd
            WHERE rd.centro_id = c.id
          ) AS redes,
          (
            SELECT json_agg(requisito ORDER BY created_at)
            FROM requisitos_centro rd
            WHERE rd.centro_id = c.id
          ) AS requisitos
        FROM centros c
        JOIN municipios m ON m.id = c.municipio_id
        JOIN estados e ON e.id = m.estado_id
        LEFT JOIN parroquias p ON p.id = c.parroquia_id
        WHERE c.id = $1
          AND c.tipo_registro = 'DIRECTORIO'
          AND c.eliminado = false`,
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

// ============================================================
// ADMIN: obtener todas las defensoras (para modo edicion)
// ============================================================
export const getDirectoryDefensoras = async (request, reply) => {
  const { centro_id } = request.query || {}

  if (!centro_id) {
    return reply.code(400).send({ status: 'BAD_REQUEST', error: 'centro_id es obligatorio' })
  }

  try {
    const response = await query(
      `SELECT d.id, d.correo, d.telefono, d.created_at
       FROM defensoras d
       WHERE d.centro_id = $1 AND d.eliminado = false
       ORDER BY d.id`,
      [centro_id]
    )
    return reply.code(200).send({ status: 'OK', data: response.rows })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

// ============================================================
// ADMIN: consulta completa (por compatibilidad si se necesita)
// ============================================================
export const getAllDirectories = async (request, reply) => {
  try {
    const response = await query(
      `SELECT
          c.id,
          c.nombre,
          COALESCE(NULLIF(BTRIM(c.organismo), ''), c.nombre) AS organismo,
          c.descripcion,
          c.direccion,
          c.foto,
          c.foto2,
          c.horario,
          p.nombre AS parroquia,
          m.nombre AS municipio,
          e.nombre AS estado,
          c.latitud::double precision AS latitud,
          c.longitud::double precision AS longitud
        FROM centros c
        JOIN municipios m ON m.id = c.municipio_id
        JOIN estados e ON e.id = m.estado_id
        LEFT JOIN parroquias p ON p.id = c.parroquia_id
        WHERE c.tipo_registro = 'DIRECTORIO'
          AND c.eliminado = false
        ORDER BY c.nombre`
    )
    return reply.code(200).send({ status: 'OK', data: response.rows, count: response.rowCount })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

// Mantener las funciones antiguas (create/update/delete por registro individual)
// como alias de las nuevas para no romper otras vistas que las usen.
export const createDirectory = createAdminCenter
export const updateDirectory = updateAdminCenter
export const deleteDirectory = deleteAdminCenter
