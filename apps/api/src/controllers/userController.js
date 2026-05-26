import query from '../database/postgre.js'
import { encrypt } from '../helpers/helperEncrypt.js'

export const getAllUser = async (request, reply) => {
    try {
        const textQuery = `SELECT id, cedula, nombre, email, username, rol FROM auth.users ORDER BY created_at DESC;`
        const resp = await query(textQuery)
        return reply.send({status: "ok", msg:`Se encontraron ${resp.rowCount} resultado(s)`, data: resp.rows});
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

export const getUserById = async (request, reply) => {
    try {
        const id = request.params.id
        const textQuery = `SELECT id, cedula, nombre, email, username, rol FROM auth.users WHERE id = $1;`
        const resp = await query(textQuery,[id])
        return reply.send({status: "ok", msg:`Se encontro ${resp.rowCount} resultado`, data: resp.rows[0]});
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: "error en la peticion", status: "failed" });
    }
}

export const updatetUser = async (request, reply) => {
    try {
        if (!request.body) {
            return reply.code(400).send({ error: 'body not valid, datos incompletos', status: 'failed' });
        }

        const { id, cedula, nombre, email, username, rol, password } = request.body

        if (typeof id !== 'string' || !id.trim() || typeof cedula !== 'number' || typeof nombre !== 'string' || typeof email !== 'string' || typeof username !== 'string' || typeof rol !== 'string') {
            return reply.code(400).send({ error: 'body not valid, error en tipo de dato', status: 'failed' })
        }

        const checkQuery = `SELECT id FROM auth.users WHERE id <> $1 AND (cedula = $2 OR email = $3 OR username = $4);`
        let resp = await query(checkQuery, [id, cedula, email.trim(), username.trim()])

        if (resp.rowCount > 0) {
            return reply.code(409).send({ error: 'Cedula, correo o usuario ya están en uso por otro registro', status: 'failed' })
        }

        let textQuery = ''
        let values = []

        if (typeof password === 'string' && password.trim()) {
            const encryptedPassword = encrypt(password.trim())
            textQuery = `UPDATE auth.users SET cedula = $1, nombre = $2, email = $3, username = $4, password = $5, rol = $6 WHERE id = $7 RETURNING id, cedula, nombre, email, username, rol;`
            values = [cedula, nombre.trim(), email.trim(), username.trim(), encryptedPassword, rol.trim(), id]
        } else {
            textQuery = `UPDATE auth.users SET cedula = $1, nombre = $2, email = $3, username = $4, rol = $5 WHERE id = $6 RETURNING id, cedula, nombre, email, username, rol;`
            values = [cedula, nombre.trim(), email.trim(), username.trim(), rol.trim(), id]
        }

        resp = await query(textQuery, values)

        if (resp.rowCount === 0) {
            return reply.code(404).send({ error: 'Usuario no encontrado', status: 'failed' })
        }

        return reply.send({ status: 'ok', msg: 'Se actualizo con exito', data: resp.rows[0] })
    } catch (error) {
        console.log(error)
        return reply.code(500).send({ error: 'error en la peticion', status: 'failed' })
    }
}

export const deleteUser = async (request, reply) => {
    try {
        const id = request.params.id
        const textQuery = `DELETE FROM auth.users WHERE id = $1 RETURNING id;`
        const resp = await query(textQuery, [id])

        if (resp.rowCount === 0) {
            return reply.code(404).send({ error: 'Usuario no encontrado', status: 'failed' })
        }

        return reply.send({ status: 'ok', msg: 'Usuario eliminado con exito' })
    } catch (error) {
        console.log(error)
        return reply.code(500).send({ error: 'error en la peticion', status: 'failed' })
    }
}

export const changeUserStatus = async (request, reply) => {
    try {
        if (!request.body) {
            return reply.code(400).send({ error: 'body not valid', status: 'failed' });
        }
        const {id,is_active} = request.body

        // Request body verification
        if (typeof id !== 'number' || typeof is_active !== 'boolean') {
            return reply.code(400).send({ error: 'body not valid', status: 'failed' })
        }
        
        const textQuery = `UPDATE auth.users SET is_active = $1 WHERE id = $2;`
        const resp = await query(textQuery,[is_active,id])
        
        // Comprueba si se actualizo con exito
        if (resp.rowCount == 0) {
            return reply.code(409).send({ error: 'error en la petición', status: 'failed' });
        }

        return reply.send({ status: 'ok', msg: `Se actualizo con exito` });
    } catch (error) {
        console.log(error) ;
        return reply.code(500).send({ error: 'error en la peticion', status: 'failed' });
    }
}

export const createUser = async (request, reply) => {
    try {
        if (!request.body) {
            return reply.code(400).send({ error: 'body not valid, datos incompletos', status: 'failed' });
        }
        const { cedula, nombre, email, username, password, rol } = request.body;

        // Request body verification
        if (typeof cedula !== 'number' || typeof nombre !== 'string' || typeof email !== 'string' || typeof username !== 'string' || typeof password !== 'string' || typeof rol !== 'string') {
            return reply.code(400).send({ error: 'body not valid, error en tipo de dato', status: 'failed' });
        }

        let textQuery = `SELECT id FROM auth.users WHERE cedula = $1 OR email = $2 OR username = $3;`;
        let resp = await query(textQuery, [cedula, email.trim(), username.trim()]);
        if (resp.rowCount > 0) {
            return reply.code(409).send({ error: 'Cédula, correo o usuario ya están en uso', status: 'failed' });
        }

        const pass = encrypt(password.trim());
        textQuery = `INSERT INTO auth.users (cedula, nombre, email, username, password, rol) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, cedula, nombre, email, username, rol;`;
        resp = await query(textQuery, [cedula, nombre.trim(), email.trim(), username.trim(), pass, rol.trim()]);

        if (resp.rowCount == 0) {
            return reply.code(409).send({ error: 'error en la petición', status: 'failed' });
        }

        return reply.send({ status: 'ok', msg: 'Se registro con exito', data: resp.rows[0] });
    } catch (error) {
        console.log(error);
        return reply.code(500).send({ error: 'internal server error', status: 'failed' });
    }
}