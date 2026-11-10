import query from '../database/postgre.js'

const NEWS_EDITOR_ROLES = ['Administrador', 'Usuario']

export const authorizeNews = async (request, reply) => {
  try {
    const result = await query(
      `SELECT r.nombre AS role
       FROM auth.users u
       JOIN auth.roles r ON r.id = u.rol_id
       JOIN auth.status s ON s.id = u.status_id
       WHERE u.id = $1 AND s.nombre = 'Activo'`,
      [request.user.id]
    )

    if (!NEWS_EDITOR_ROLES.includes(result.rows[0]?.role)) {
      return reply.code(403).send({
        status: 'failed',
        error: 'No tienes permisos para gestionar noticias.',
      })
    }
  } catch (error) {
    console.error(error)
    return reply.code(500).send({
      status: 'failed',
      error: 'No se pudieron validar los permisos.',
    })
  }
}
