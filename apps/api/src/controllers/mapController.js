import query from '../database/postgre.js'

export const getMapCenters = async (_request, reply) => {
  try {
    const response = await query(`
      WITH map_centers AS (
        SELECT
          c.id,
          c.nombre,
          c.descripcion,
          c.organismo,
          COALESCE(c.tipo_organismo, 'OTRA') AS tipo_organismo,
          c.direccion,
          COALESCE(p.nombre, 'No indicada') AS parroquia,
          m.nombre AS municipio,
          e.nombre AS estado,
          c.latitud::double precision AS latitud,
          c.longitud::double precision AS longitud,
          c.calificacion::double precision AS calificacion
        FROM centros c
        JOIN municipios m ON m.id = c.municipio_id
        JOIN estados e ON e.id = m.estado_id
        LEFT JOIN parroquias p ON p.id = c.parroquia_id
        WHERE c.latitud IS NOT NULL
          AND c.longitud IS NOT NULL
          AND c.tipo_registro = 'MAPA'

        UNION ALL

        SELECT
          MIN(c.id) AS id,
          STRING_AGG(DISTINCT COALESCE(NULLIF(BTRIM(c.organismo), ''), c.nombre), ' / '
            ORDER BY COALESCE(NULLIF(BTRIM(c.organismo), ''), c.nombre)) AS nombre,
          STRING_AGG(DISTINCT NULLIF(BTRIM(c.descripcion), ''), ' '
            ORDER BY NULLIF(BTRIM(c.descripcion), '')) AS descripcion,
          STRING_AGG(DISTINCT COALESCE(NULLIF(BTRIM(c.organismo), ''), c.nombre), ' / '
            ORDER BY COALESCE(NULLIF(BTRIM(c.organismo), ''), c.nombre)) AS organismo,
          CASE
            WHEN COUNT(DISTINCT c.tipo_organismo) = 1 THEN MAX(c.tipo_organismo)
            ELSE 'OTRA'
          END AS tipo_organismo,
          MAX(c.direccion) AS direccion,
          COALESCE(MAX(p.nombre), 'No indicada') AS parroquia,
          m.nombre AS municipio,
          e.nombre AS estado,
          c.latitud::double precision AS latitud,
          c.longitud::double precision AS longitud,
          MAX(c.calificacion)::double precision AS calificacion
        FROM centros c
        JOIN municipios m ON m.id = c.municipio_id
        JOIN estados e ON e.id = m.estado_id
        LEFT JOIN parroquias p ON p.id = c.parroquia_id
        WHERE c.latitud IS NOT NULL
          AND c.longitud IS NOT NULL
          AND c.tipo_registro = 'DIRECTORIO'
        GROUP BY
          m.id,
          e.id,
          c.latitud,
          c.longitud,
          c.municipio_id,
          LOWER(BTRIM(c.direccion))
      )
      SELECT *
      FROM map_centers
      ORDER BY estado, nombre
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
