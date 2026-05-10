import query from '../database/postgre.js'

export const testDb = async (request, reply) => {
    try {
        const response = await query(`SELECT * FROM test`)
        return reply.code(200).send({ status: "OK", data: response.rows })
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "Error interno", status: "failed" });
    }
}