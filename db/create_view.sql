CREATE OR REPLACE VIEW vw_users_list AS
SELECT
    u.id,
    u.cedula,
    u.nombre,
    u.email,
    u.username,
    r.nombre AS rol,
    s.nombre AS status
FROM auth.users u
JOIN auth.roles r ON r.id = u.rol_id
JOIN auth.status s ON s.id = u.status_id
WHERE u.status_id <> 3;

CREATE OR REPLACE VIEW vw_directorios_list AS
SELECT
    d.id,
    d.nombre,
    d.direccion,
    d.telefono,
    d.foto,
    d.correo,
    d.horario,
    m.nombre AS municipio,
    e.nombre AS estado
FROM directorios d
JOIN municipios m ON m.id = d.municipio_id
JOIN estados e ON e.id = m.estado_id;

CREATE OR REPLACE VIEW vw_directorio_detalle AS
SELECT
    d.id,
    d.nombre,
    d.descripcion,
    d.direccion,
    d.telefono,
    d.correo,
    d.foto,
    d.horario,
    m.nombre AS municipio,
    e.nombre AS estado,
    (
        SELECT json_agg(servicio ORDER BY created_at)
        FROM servicios_directorio sd
        WHERE sd.directorio_id = d.id
    ) AS servicios,
    (
        SELECT json_agg(jsonb_build_object('nombre', nombre, 'cargo', cargo) ORDER BY created_at)
        FROM responsables_directorio rd
        WHERE rd.directorio_id = d.id
    ) AS responsables,
    (
        SELECT json_agg(jsonb_build_object('nombre', nombre, 'url', url, 'icono', icono) ORDER BY created_at)
        FROM redes_directorio rd
        WHERE rd.directorio_id = d.id
    ) AS redes
FROM directorios d
JOIN municipios m ON m.id = d.municipio_id
JOIN estados e ON e.id = m.estado_id;

CREATE OR REPLACE VIEW vw_courses_list AS
SELECT
    id,
    title,
    description,
    duration,
    level,
    image,
    start_date
FROM courses
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW vw_course_detail AS
SELECT
    c.id,
    c.title,
    c.description,
    c.full_description,
    c.instructor,
    c.instructor_bio,
    c.duration,
    c.level,
    c.image,
    c.start_date,
    (
        SELECT json_agg(jsonb_build_object('id', m.id, 'title', m.title, 'duration', m.duration, 'order', m.orden) ORDER BY m.orden)
        FROM course_modules m
        WHERE m.course_id = c.id
    ) AS modules,
    (
        SELECT json_agg(jsonb_build_object('id', r.id, 'requirement', r.requirement, 'order', r.orden) ORDER BY r.orden)
        FROM course_requirements r
        WHERE r.course_id = c.id
    ) AS requirements,
    (
        SELECT json_agg(jsonb_build_object('id', o.id, 'outcome', o.outcome, 'order', o.orden) ORDER BY o.orden)
        FROM course_outcomes o
        WHERE o.course_id = c.id
    ) AS outcomes
FROM courses c;