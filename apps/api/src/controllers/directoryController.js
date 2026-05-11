import query from '../database/postgre.js'

export const getDirectories = async (request, reply) => {
  const { estado, municipio } = request.query || {}

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

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

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
        FROM directorios d
        JOIN municipios m ON m.id = d.municipio_id
        JOIN estados e ON e.id = m.estado_id
        ${whereClause}
        ORDER BY d.nombre`,
      values
    )

    return reply.code(200).send({ status: 'OK', data: response.rows })
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
          m.nombre AS municipio,
          e.nombre AS estado,
          (
            SELECT json_agg(servicio ORDER BY created_at)
            FROM servicios_directorio sd
            WHERE sd.directorio_id = d.id
          ) AS servicios,
          (
            SELECT json_agg(jsonb_build_object('nombre', nombre, 'cargo', cargo) ORDER BY created_at)
            FROM responsables_directorio rd
            WHERE rd.directorio_id = d.id
          ) AS responsables,
          (
            SELECT json_agg(jsonb_build_object('nombre', nombre, 'url', url, 'icono', icono) ORDER BY created_at)
            FROM redes_directorio rd
            WHERE rd.directorio_id = d.id
          ) AS redes
        FROM directorios d
        JOIN municipios m ON m.id = d.municipio_id
        JOIN estados e ON e.id = m.estado_id
        WHERE d.id = $1`,
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

export const createDirectory = async (request, reply) => {
  const {
    nombre,
    descripcion,
    direccion,
    telefono,
    correo,
    foto,
    horario,
    estado,
    municipio,
    servicios = [],
    responsables = [],
    redes = []
  } = request.body

  // Validación básica
  if (!nombre || !direccion || !telefono || !estado || !municipio) {
    return reply.code(400).send({ status: 'BAD_REQUEST', error: 'Campos obligatorios faltantes' })
  }

  try {
    // Iniciar transacción
    await query('BEGIN')

    // Obtener municipio_id
    const municipioResult = await query(
      `SELECT m.id FROM municipios m
       JOIN estados e ON e.id = m.estado_id
       WHERE e.nombre = $1 AND m.nombre = $2`,
      [estado, municipio]
    )

    if (municipioResult.rowCount === 0) {
      await query('ROLLBACK')
      return reply.code(400).send({ status: 'BAD_REQUEST', error: 'Estado o municipio no encontrado' })
    }

    const municipioId = municipioResult.rows[0].id

    // Insertar directorio
    const directorioResult = await query(
      `INSERT INTO directorios (nombre, descripcion, direccion, telefono, correo, foto, municipio_id, horario)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [nombre, descripcion, direccion, telefono, correo, foto, municipioId, horario]
    )

    const directorioId = directorioResult.rows[0].id

    // Insertar servicios
    if (servicios.length > 0) {
      const servicioValues = servicios.map(servicio => `(${directorioId}, '${servicio.replace(/'/g, "''")}')`).join(', ')
      await query(
        `INSERT INTO servicios_directorio (directorio_id, servicio) VALUES ${servicioValues}`
      )
    }

    // Insertar responsables
    if (responsables.length > 0) {
      const responsableValues = responsables.map(r =>
        `(${directorioId}, '${r.nombre.replace(/'/g, "''")}', '${r.cargo.replace(/'/g, "''")}')`
      ).join(', ')
      await query(
        `INSERT INTO responsables_directorio (directorio_id, nombre, cargo) VALUES ${responsableValues}`
      )
    }

    // Insertar redes
    if (redes.length > 0) {
      const redValues = redes.map(r =>
        `(${directorioId}, '${r.nombre.replace(/'/g, "''")}', '${r.url.replace(/'/g, "''")}', ${r.icono ? `'${r.icono.replace(/'/g, "''")}'` : 'NULL'})`
      ).join(', ')
      await query(
        `INSERT INTO redes_directorio (directorio_id, nombre, url, icono) VALUES ${redValues}`
      )
    }

    // Confirmar transacción
    await query('COMMIT')

    return reply.code(201).send({ status: 'CREATED', message: 'Directorio creado exitosamente', id: directorioId })
  } catch (error) {
    await query('ROLLBACK')
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}
