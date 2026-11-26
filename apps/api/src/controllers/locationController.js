import query from '../database/postgre.js'

export const stateById = async (request, reply) => {
    try {
        const id = request.params.id

        const response = await query(`SELECT * FROM estados WHERE id = $1 ORDER BY nombre ASC`, [id])
        return reply.code(200).send({ status: "OK", data: response.rows })
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "Error interno", status: "failed" });
    }
}

export const statesAll = async (request, reply) => {
    try {
        const response = await query('SELECT * FROM estados')
        return reply.code(200).send({ status: "OK", data: response.rows })
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "Error interno", status: "failed" });
    }
}

export const municipalityByStateId = async (request, reply) => {
    try {
        const id = request.params.id

        const response = await query(`SELECT id, nombre FROM municipios WHERE estado_id = $1`, [id])
        return reply.code(200).send({ status: "OK", data: response.rows })
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "Error interno", status: "failed" });
    }
}

export const municipalitiesAll = async (request, reply) => {
    try {
        const response = await query('SELECT id, nombre FROM municipios')
        return reply.code(200).send({ status: "OK", data: response.rows })
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "Error interno", status: "failed" });
    }
}

export const allLocations = async (request, reply) => {
    try {
        const resultMunicipality = await query(`
        SELECT json_object_agg(estado, municipios)
        FROM (
            SELECT 
                e.nombre AS estado, 
                json_agg(m.nombre) AS municipios
            FROM estados e
            JOIN municipios m ON e.id = m.estado_id
            GROUP BY e.nombre
        ) subconsulta`)

        const resultParishes = await query(`
        SELECT
            e.nombre AS estado,
            m.nombre AS municipio,
            COALESCE(
                json_agg(p.nombre ORDER BY p.nombre) FILTER (WHERE p.id IS NOT NULL),
                '[]'::json
            ) AS parroquias
        FROM estados e
        JOIN municipios m ON e.id = m.estado_id
        LEFT JOIN parroquias p ON m.id = p.municipio_id
        GROUP BY e.id, e.nombre, m.id, m.nombre
        ORDER BY e.nombre, m.nombre`)

        const resultStates = await query('SELECT nombre FROM estados ORDER BY nombre ASC')

        const states = resultStates.rows.map((state) => state.nombre)
        const municipalities = resultMunicipality.rows[0].json_object_agg
        const parishes = resultParishes.rows.reduce((locations, row) => {
            locations[row.estado] ??= {}
            locations[row.estado][row.municipio] = row.parroquias
            return locations
        }, {})

        return reply.code(200).send({ status: "OK", data: { states, municipalities, parishes } })
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "Error interno", status: "failed" });
    }
}