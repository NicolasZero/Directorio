import query from '../database/postgre.js'

export const getMapCenters = async (_request, reply) => {
  try {
    const response = await query(`
      SELECT
        c.id,
        c.nombre,
        c.descripcion,
        c.organismo,
        c.tipo_organismo,
        c.direccion,
        p.nombre AS parroquia,
        m.nombre AS municipio,
        e.nombre AS estado,
        c.latitud::double precision AS latitud,
        c.longitud::double precision AS longitud,
        c.calificacion::double precision AS calificacion
      FROM centros_atencion c
      JOIN parroquias p ON p.id = c.parroquia_id
      JOIN municipios m ON m.id = p.municipio_id
      JOIN estados e ON e.id = m.estado_id
      ORDER BY e.nombre, c.nombre
    `)

    return reply.code(200).send({
      status: 'OK',
      data: response.rows,
      count: response.rowCount
    })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({
      status: 'failed',
      error: 'No se pudieron cargar las sedes del mapa'
    })
  }
}
