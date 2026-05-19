import query from '../database/postgre.js'

export const getAdminStats = async (request, reply) => {
  try {
    const response = await query(
      `SELECT
        (SELECT COUNT(*) FROM directorios) AS directorios,
        (SELECT COUNT(*) FROM courses) AS cursos`
    )

    return reply.code(200).send({ status: 'OK', data: response.rows[0] })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}
