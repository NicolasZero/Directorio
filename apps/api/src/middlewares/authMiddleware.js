import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const ACCESS_COOKIE_NAME = 'directorio-token';

export const authenticate = async (request, reply) => {
    try {
        const token = request.cookies[ACCESS_COOKIE_NAME];

        if (!token) {
            return reply.code(401).send({
                error: 'Acceso denegado. Token no proporcionado.',
                status: 'failed'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        // Verificamos que sea un token de acceso y no de refresco
        if (decoded.tokenType !== 'access') {
            return reply.code(401).send({
                error: 'Acceso denegado. Token inválido.',
                status: 'failed'
            });
        }

        // Inyectamos los datos del usuario decodificados en el objeto request
        request.user = decoded;
    } catch (error) {
        return reply.code(401).send({
            error: 'Acceso denegado. Token inválido o expirado.',
            status: 'failed'
        });
    }
};
