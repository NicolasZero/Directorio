CREATE VIEW vw_directorios_list AS
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

CREATE VIEW vw_directorio_detalle AS
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