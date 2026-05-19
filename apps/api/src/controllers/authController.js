import query from '../database/postgre.js'
import { encrypt, compareEncrypt } from '../helpers/helperEncrypt.js'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const ACCESS_TOKEN_EXPIRATION = '1h';
const REFRESH_TOKEN_EXPIRATION = '7d';
const ACCESS_COOKIE_NAME = 'directorio-token';
const REFRESH_COOKIE_NAME = 'directorio-refresh-token';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
};

const createAccessToken = (payload) => jwt.sign({ ...payload, tokenType: 'access' }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
const createRefreshToken = (payload) => jwt.sign({ ...payload, tokenType: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

const sendTokens = (reply, accessToken, refreshToken) => {
  reply.setCookie(ACCESS_COOKIE_NAME, accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60,
  });
  reply.setCookie(REFRESH_COOKIE_NAME, refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60,
  });
};

const getUserData = (row) => ({
  id: row.id,
  username: row.username,
  nombre: row.nombre,
  email: row.email,
  role: row.rol,
});

const verifyAccessToken = (token) => {
  const decoded = jwt.verify(token, JWT_SECRET);
  if (decoded.tokenType !== 'access') {
    throw new Error('Invalid access token');
  }
  return decoded;
};

const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, JWT_SECRET);
  if (decoded.tokenType !== 'refresh') {
    throw new Error('Invalid refresh token');
  }
  return decoded;
};

const refreshAccessToken = async (request, reply) => {
  const refreshToken = request.cookies[REFRESH_COOKIE_NAME];
  if (!refreshToken) {
    return reply.code(401).send({ error: 'Refresh token no proporcionado', status: 'failed' });
  }

  try {
    const decodedRefresh = verifyRefreshToken(refreshToken);
    const resp = await query(`SELECT id, cedula, nombre, email, username, rol FROM auth.users where id=$1;`, [decodedRefresh.id]);

    if (resp.rowCount !== 1) {
      return reply.code(401).send({ error: 'Usuario no encontrado', status: 'failed' });
    }

    const accessToken = createAccessToken({ id: resp.rows[0].id, username: resp.rows[0].username });
    sendTokens(reply, accessToken, refreshToken);

    return reply.code(200).send({ data: getUserData(resp.rows[0]), status: 'OK', refreshed: true });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return reply.code(401).send({ error: 'Refresh token expirado', status: 'failed' });
    }
    return reply.code(401).send({ error: 'Token inválido', status: 'failed' });
  }
};

export const auth = async (request, reply) => {
  try {
    const { user, pass } = request.body;

    if (!user || !pass) {
      return reply.code(401).send({ error: 'Usuario o contraseña incorrecta', status: 'failed' });
    }

    const resp = await query(`SELECT id, cedula, nombre, email, username, rol, password FROM auth.users where UPPER(username)=UPPER($1);`, [user]);

    if (resp.rowCount != 1) {
      return reply.code(401).send({ error: 'Usuario o contraseña incorrecta', status: 'failed' });
    }

    const checkPass = await compareEncrypt(pass, resp.rows[0].password);

    if (!checkPass) {
      return reply.code(401).send({ error: 'Usuario o contraseña incorrecta', status: 'failed' });
    }

    const accessToken = createAccessToken({ id: resp.rows[0].id, username: resp.rows[0].username });
    const refreshToken = createRefreshToken({ id: resp.rows[0].id, username: resp.rows[0].username });

    sendTokens(reply, accessToken, refreshToken);

    const data = getUserData(resp.rows[0]);
    return reply.code(200).send({ data, status: 'OK' });
  } catch (error) {
    reply.code(500).send({ error: 'Error de servidor', status: 'failed' });
    reply.log.error(error);
  }
};

export const validateToken = async (request, reply) => {
  try {
    const token = request.cookies[ACCESS_COOKIE_NAME];
    if (!token) {
      return await refreshAccessToken(request, reply);
    }

    try {
      const decoded = verifyAccessToken(token);
      const resp = await query(`SELECT id, cedula, nombre, email, username, rol FROM auth.users where id=$1;`, [decoded.id]);

      if (resp.rowCount != 1) {
        return reply.code(401).send({ error: 'Usuario no encontrado', status: 'failed' });
      }

      return reply.code(200).send({ data: getUserData(resp.rows[0]), status: 'OK' });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return await refreshAccessToken(request, reply);
      }
      return reply.code(401).send({ error: 'Token inválido', status: 'failed' });
    }
  } catch (error) {
    return reply.code(401).send({ error: 'Token inválido', status: 'failed' });
  }
};

export const refreshToken = async (request, reply) => {
  return await refreshAccessToken(request, reply);
};

export const logout = async (request, reply) => {
  try {
    reply.clearCookie(ACCESS_COOKIE_NAME, {
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    reply.clearCookie(REFRESH_COOKIE_NAME, {
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    return reply.code(200).send({ status: 'OK' });
  } catch (error) {
    reply.code(500).send({ error: 'Error de servidor', status: 'failed' });
  }
};
