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

export const parroquiasByMunicipio = async (request, reply) => {
    try {
        const { estado, municipio } = request.query || {}

        if (!estado || !municipio) {
            return reply.code(400).send({ error: 'estado y municipio son obligatorios', status: 'failed' })
        }

        const response = await query(
            `SELECT p.nombre
             FROM parroquias p
             JOIN municipios m ON m.id = p.municipio_id
             JOIN estados e ON e.id = m.estado_id
             WHERE e.nombre = $1 AND m.nombre = $2
             ORDER BY p.nombre ASC`,
            [estado, municipio]
        )
        return reply.code(200).send({ status: 'OK', data: response.rows.map((r) => r.nombre) })
    } catch (error) {
        console.log(error)
        return reply.code(500).send({ error: 'Error interno', status: 'failed' })
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

        const resultStates = await query('SELECT nombre FROM estados ORDER BY nombre ASC')

        const states = resultStates.rows.map((state) => state.nombre)
        const municipalities = resultMunicipality.rows[0].json_object_agg

        return reply.code(200).send({ status: "OK", data: { states, municipalities } })
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "Error interno", status: "failed" });
    }
}