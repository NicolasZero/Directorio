import query from '../database/postgre.js'
import { encrypt, compareEncrypt } from '../helpers/helperEncrypt.js'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const auth = async (request, reply) => {
    try {
        const { user, pass } = request.body

        if (!user || !pass) {
            return reply.code(401).send({ error: "Usuario o contraseña incorrecta", status: "failed" });
        }

        const resp = await query(`SELECT id, cedula, nombre, email, username, rol, password FROM users where UPPER(username)=UPPER($1);`, [user])

        if (resp.rowCount != 1) {
            return reply.code(401).send({ error: "Usuario o contraseña incorrecta", status: "failed" });
        }

        const checkPass = await compareEncrypt(pass, resp.rows[0].password);

        if (!checkPass) {
            return reply.code(401).send({ error: "Usuario o contraseña incorrecta", status: "failed" });
        }

        const token = jwt.sign({ id: resp.rows[0].id, username: resp.rows[0].username }, JWT_SECRET, { expiresIn: '1h' });

        // Set HttpOnly cookie
        reply.setCookie('directorio-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure in production
            sameSite: 'strict',
            maxAge: 3600 // 1 hour
        });

        const data = {
            id: resp.rows[0].id,
            username: resp.rows[0].username,
            nombre: resp.rows[0].nombre,
            email: resp.rows[0].email,
            role: resp.rows[0].rol
        }

        return reply.code(200).send({ data, status: "OK" });

    } catch (error) {
        reply.code(500).send({ error: "Error de servidor", status: "failed" });
        reply.log.error(error);
    }
}

export const validateToken = async (request, reply) => {
    try {
        const token = request.cookies['directorio-token'];
        if (!token) {
            return reply.code(401).send({ error: "Token no proporcionado", status: "failed" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        // Fetch user data from DB
        const resp = await query(`SELECT id, cedula, nombre, email, username, rol FROM users where id=$1;`, [decoded.id]);

        if (resp.rowCount != 1) {
            return reply.code(401).send({ error: "Usuario no encontrado", status: "failed" });
        }

        const data = {
            id: resp.rows[0].id,
            username: resp.rows[0].username,
            nombre: resp.rows[0].nombre,
            email: resp.rows[0].email,
            role: resp.rows[0].rol
        };

        return reply.code(200).send({ data, status: "OK" });
    } catch (error) {
        return reply.code(401).send({ error: "Token inválido", status: "failed" });
    }
}

export const logout = async (request, reply) => {
    try {
        reply.clearCookie('directorio-token');
        return reply.code(200).send({ status: "OK" });
    } catch (error) {
        reply.code(500).send({ error: "Error de servidor", status: "failed" });
    }
}