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
