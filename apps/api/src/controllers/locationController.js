import query from '../database/postgre.js'

export const stateById = async (request, reply) => {
    try {
        const id = request.params.id

        const response = await query(`SELECT * FROM estados WHERE id = $1`, [id])
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

        const resultStates = await query('SELECT nombre FROM estados')

        const states = resultStates.rows.map((state) => state.nombre)
        const municipalities = resultMunicipality.rows[0].json_object_agg

        return reply.code(200).send({ status: "OK", data: { states, municipalities } })
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "Error interno", status: "failed" });
    }
}