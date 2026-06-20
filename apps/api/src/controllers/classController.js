import query from '../database/postgre.js'

export const getClasses = async (request, reply) => {
  const { page, limit } = request.query || {}
  const parsedPage = parseInt(page, 10) || 1
  const parsedLimit = parseInt(limit, 10) || 9
  const offset = (parsedPage - 1) * parsedLimit

  try {
    const response = await query(
      `SELECT id, title, description, duration, level, image, start_date, instructor
       FROM courses
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [parsedLimit, offset]
    )

    return reply.code(200).send({ status: 'OK', data: response.rows })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

export const getCountClasses = async (request, reply) => {
  try {
    const response = await query(
      `SELECT 
        COUNT(*) as total_cursos,
        COALESCE(SUM(NULLIF(regexp_replace(duration, '\\D', '', 'g'), '')::integer), 0) as total_horas,
        COUNT(DISTINCT level) as total_niveles
      FROM courses`
    )
    return reply.code(200).send({ status: 'OK', data: response.rows[0] })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

export const getClassById = async (request, reply) => {
  const { id } = request.params

  try {
    const response = await query(
      `SELECT * FROM vw_course_detail WHERE id = $1`,
      [id]
    )

    if (response.rowCount === 0) {
      return reply.code(404).send({ status: 'NOT_FOUND', message: 'Curso no encontrado' })
    }

    return reply.code(200).send({ status: 'OK', data: response.rows[0] })
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

export const createClass = async (request, reply) => {
  const {
    title,
    description,
    fullDescription,
    instructor,
    instructorBio,
    duration,
    level,
    image,
    startDate,
    modules = [],
    requirements = [],
    outcomes = []
  } = request.body

  if (!title || !description || !instructor || !duration || !level) {
    return reply.code(400).send({ status: 'BAD_REQUEST', error: 'Faltan campos obligatorios' })
  }

  try {
    await query('BEGIN')

    const courseResult = await query(
      `INSERT INTO courses (title, description, full_description, instructor, instructor_bio, duration, level, image, start_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [title, description, fullDescription, instructor, instructorBio, duration, level, image, startDate || null]
    )

    const courseId = courseResult.rows[0].id

    for (let index = 0; index < modules.length; index += 1) {
      const module = modules[index]
      if (module?.title && module?.duration) {
        await query(
          `INSERT INTO course_modules (course_id, title, duration, orden)
           VALUES ($1, $2, $3, $4)`,
          [courseId, module.title, module.duration, index + 1]
        )
      }
    }

    for (let index = 0; index < requirements.length; index += 1) {
      const requirement = requirements[index]
      if (requirement?.trim()) {
        await query(
          `INSERT INTO course_requirements (course_id, requirement, orden)
           VALUES ($1, $2, $3)`,
          [courseId, requirement.trim(), index + 1]
        )
      }
    }

    for (let index = 0; index < outcomes.length; index += 1) {
      const outcome = outcomes[index]
      if (outcome?.trim()) {
        await query(
          `INSERT INTO course_outcomes (course_id, outcome, orden)
           VALUES ($1, $2, $3)`,
          [courseId, outcome.trim(), index + 1]
        )
      }
    }

    await query('COMMIT')
    return reply.code(201).send({ status: 'CREATED', message: 'Curso creado exitosamente', id: courseId })
  } catch (error) {
    await query('ROLLBACK')
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

export const updateClass = async (request, reply) => {
  const { id } = request.params
  const {
    title,
    description,
    fullDescription,
    instructor,
    instructorBio,
    duration,
    level,
    image,
    startDate,
    modules = [],
    requirements = [],
    outcomes = []
  } = request.body

  if (!title || !description || !instructor || !duration || !level) {
    return reply.code(400).send({ status: 'BAD_REQUEST', error: 'Faltan campos obligatorios' })
  }

  try {
    await query('BEGIN')

    const updateResult = await query(
      `UPDATE courses
       SET title = $1,
           description = $2,
           full_description = $3,
           instructor = $4,
           instructor_bio = $5,
           duration = $6,
           level = $7,
           image = $8,
           start_date = $9,
           updated_at = NOW()
       WHERE id = $10`,
      [title, description, fullDescription, instructor, instructorBio, duration, level, image, startDate || null, id]
    )

    if (updateResult.rowCount === 0) {
      await query('ROLLBACK')
      return reply.code(404).send({ status: 'NOT_FOUND', error: 'Curso no encontrado' })
    }

    await query('DELETE FROM course_modules WHERE course_id = $1', [id])
    await query('DELETE FROM course_requirements WHERE course_id = $1', [id])
    await query('DELETE FROM course_outcomes WHERE course_id = $1', [id])

    for (let index = 0; index < modules.length; index += 1) {
      const module = modules[index]
      if (module?.title && module?.duration) {
        await query(
          `INSERT INTO course_modules (course_id, title, duration, orden)
           VALUES ($1, $2, $3, $4)`,
          [id, module.title, module.duration, index + 1]
        )
      }
    }

    for (let index = 0; index < requirements.length; index += 1) {
      const requirement = requirements[index]
      if (requirement?.trim()) {
        await query(
          `INSERT INTO course_requirements (course_id, requirement, orden)
           VALUES ($1, $2, $3)`,
          [id, requirement.trim(), index + 1]
        )
      }
    }

    for (let index = 0; index < outcomes.length; index += 1) {
      const outcome = outcomes[index]
      if (outcome?.trim()) {
        await query(
          `INSERT INTO course_outcomes (course_id, outcome, orden)
           VALUES ($1, $2, $3)`,
          [id, outcome.trim(), index + 1]
        )
      }
    }

    await query('COMMIT')
    return reply.code(200).send({ status: 'OK', message: 'Curso actualizado exitosamente' })
  } catch (error) {
    await query('ROLLBACK')
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}

export const deleteClass = async (request, reply) => {
  const { id } = request.params

  try {
    await query('BEGIN')

    await query('DELETE FROM course_modules WHERE course_id = $1', [id])
    await query('DELETE FROM course_requirements WHERE course_id = $1', [id])
    await query('DELETE FROM course_outcomes WHERE course_id = $1', [id])

    const courseResult = await query('DELETE FROM courses WHERE id = $1', [id])

    if (courseResult.rowCount === 0) {
      await query('ROLLBACK')
      return reply.code(404).send({ status: 'NOT_FOUND', error: 'Curso no encontrado' })
    }

    await query('COMMIT')
    return reply.code(200).send({ status: 'OK', message: 'Curso eliminado exitosamente' })
  } catch (error) {
    await query('ROLLBACK')
    console.error(error)
    return reply.code(500).send({ status: 'failed', error: 'Error interno del servidor' })
  }
}
