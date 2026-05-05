import query from '../database/postgre.js'
import { encrypt } from '../helpers/helperEncrypt.js'

export const testController = async (request, reply) => {
    try {
        return reply.code(200).send({ status: "OK", data: "test" })
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "Error interno", status: "failed" });
    }
}

export const testDb = async (request, reply) => {
    try {
        const response = await query(`SELECT * FROM test`)
        return reply.code(200).send({ status: "OK", data: response.rows })
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "Error interno", status: "failed" });
    }
}

export const testEncrypt = async (request, reply) => {
    try {
        const { data } = request.body
        return reply.code(200).send({ status: "OK", data: encrypt(data) })
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "Error interno", status: "failed" });
    }
}