-- Importacion idempotente de sedes georreferenciadas suministradas por el usuario.
-- Ejecutar despues de create_table.sql, inster_data.sql y parroquias.sql.
-- Desarrollador: Ing. Marco Quintana | Fecha: 2026-11-14
--
-- Las sedes regionales/municipales se conservan como OTRA; no se presume que
-- dependan del INAMUJER nacional o del Ministerio. Confirmar afiliaciones antes
-- de cambiar esta clasificacion.

BEGIN;

CREATE TEMP TABLE centros_suministrados (
    nombre varchar NOT NULL,
    descripcion text,
    organismo varchar NOT NULL,
    tipo_organismo varchar NOT NULL,
    direccion varchar NOT NULL,
    estado varchar NOT NULL,
    municipio varchar NOT NULL,
    parroquia varchar NOT NULL,
    latitud numeric(9, 6) NOT NULL,
    longitud numeric(9, 6) NOT NULL,
    calificacion numeric(2, 1)
) ON COMMIT DROP;

INSERT INTO centros_suministrados VALUES
    ('Instituto Nacional de la Mujer', 'Sede principal para atencion juridica, orientacion psicosocial y recepcion de denuncias.', 'INAMUJER', 'INAMUJER', 'Boulevard Panteon, Esquina de Jesuitas, Torre Bandagro, Pisos 1, 2 y 3, Caracas 1010.', 'CARACAS', 'LIBERTADOR', 'Altagracia', 10.508, -66.911, 4.7),
    ('MinPPmujer', 'Despacho ministerial central encargado de coordinar las politicas nacionales de genero.', 'Ministerio del Poder Popular para la Mujer', 'MINISTERIO', 'Avenida Urdaneta, sector centro, Caracas 1090.', 'CARACAS', 'LIBERTADOR', 'Urdaneta', 10.505, -66.910, NULL),
    ('Instituto de la mujer', 'Atiende solicitudes y programas regionales en Los Teques.', 'Instituto de la Mujer de Guaicaipuro', 'OTRA', 'Sector Islas Canarias, Galpon #5 C. El Liceo, Los Teques 1201.', 'MIRANDA', 'GUAICAIPURO', 'Los Teques', 10.345, -67.042, 5.0),
    ('Instituto de la Mujer Municipio Sucre', 'Coordina la atencion local y comunitaria en el municipio Sucre.', 'Instituto de la Mujer Municipio Sucre', 'OTRA', 'Redoma de Edificio Festival del Niño, Petare.', 'MIRANDA', 'SUCRE', 'Petare', 10.485, -66.812, 3.2),
    ('Centro de Atencion Integral Venezuela Mujer-Inamujer Zulia', 'Centro multidisciplinario de asesoria legal y respaldo en la region occidental.', 'INAMUJER', 'INAMUJER', 'Avenida 3E, zona norte urbana, Maracaibo 4002.', 'ZULIA', 'MARACAIBO', 'Olegario Villalobos', 10.654, -71.609, 4.2),
    ('INAMUJER', 'Oficina regional que centraliza la recepcion de casos y programas de genero zulianos.', 'INAMUJER', 'INAMUJER', 'Zona urbana central, Maracaibo 4005.', 'ZULIA', 'MARACAIBO', 'Olegario Villalobos', 10.641, -71.612, 5.0),
    ('Centro de Atencion y Formacion Integral para la Mujer', 'CAFIM: capacitacion y proteccion social en Valencia.', 'Centro de Atencion y Formacion Integral para la Mujer', 'OTRA', 'Urbanizacion Los Caobos, Calle El Roble, Casa 113A-08, Valencia 2001.', 'CARABOBO', 'VALENCIA', 'San José', 10.162, -68.007, 3.0),
    ('IREMUJER', 'Gestiona politicas estadales de proteccion y defensa de las mujeres larenses.', 'IREMUJER Lara', 'OTRA', 'Calle 54 con carreras interurbanas, Barquisimeto 3001.', 'LARA', 'IRIBARREN', 'Catedral', 10.067, -69.347, 3.4),
    ('IMA (Instituto de la Mujer en Aragua)', 'Coordina defensorias y atencion integral en municipios aragueños.', 'Instituto de la Mujer en Aragua', 'OTRA', 'Zona centrica de Maracay, Maracay 2103.', 'ARAGUA', 'GIRARDOT (MARACAY)', 'Las Delicias', 10.246, -67.595, 4.0),
    ('Instituto Autonomo de la Mujer Mama Rosa', 'Brinda atencion especializada y programas sociales en la region guayanesa.', 'Instituto Autonomo de la Mujer Mama Rosa', 'OTRA', 'Zona centrica de Ciudad Bolivar 8001.', 'BOLIVAR', 'ANGOSTURA DEL ORINOCO (HERES)', 'Catedral', 8.125, -63.542, 4.5),
    ('INTAMUJER', 'Atiende la proteccion de los derechos de las mujeres en San Cristobal.', 'INTAMUJER', 'OTRA', 'Sector La Guacara, San Cristobal 5001.', 'TACHIRA', 'SAN CRISTOBAL', 'San Cristóbal', 7.766, -72.223, 4.0),
    ('IREMUJER', 'Articula planes institucionales de genero en el estado Falcon.', 'IREMUJER Falcon', 'OTRA', 'Avenida Josefa Camejo con Avenida Manaure, Coro 4101.', 'FALCON', 'MIRANDA', 'San Antonio', 11.404, -69.674, 4.8),
    ('Instituto Regional de la Mujer Barinas', 'Coordina asistencia social y legal en Barinas.', 'Instituto Regional de la Mujer Barinas', 'OTRA', 'Edificio Sede de la Prefectura, Avenida Marques del Pumar, Barinas 5201.', 'BARINAS', 'BARINAS', 'El Carmen', 8.622, -70.207, 4.3),
    ('Instituto Merideño de La Mujer y Familia', 'Ofrece atencion familiar y proteccion a la mujer en la zona andina.', 'Instituto Merideño de La Mujer y Familia', 'OTRA', 'Residencias Aguas Blancas, detras del Liceo Caracciolo Parra, Merida 5101.', 'MERIDA', 'LIBERTADOR', 'Milla', 8.601, -71.150, NULL),
    ('Instituto Municipal de la Mujer (Immujer) Paez', 'Atiende el desarrollo social y la defensa de la mujer en Acarigua.', 'Instituto Municipal de la Mujer Paez', 'OTRA', 'Plaza Andres Eloy Blanco, Acarigua 3301.', 'PORTUGUESA', 'PAEZ', 'Acarigua', 9.560, -69.196, 4.0),
    ('Instituto Estadal de la Mujer y Familia', 'Gestiona proteccion social en Maturin y zonas aledañas.', 'Instituto Estadal de la Mujer y Familia', 'OTRA', 'Calle 11, sector Los Godos, Maturin 6201.', 'MONAGAS', 'MATURIN', 'Los Godos', 9.743, -63.178, 4.3),
    ('Instituto Nacional de la Mujer', 'Coordinacion estadal para asesoria y defensa legal en San Felipe.', 'INAMUJER', 'INAMUJER', 'Zona centrica institucional, San Felipe 3201.', 'YARACUY', 'SAN FELIPE', 'San Felipe', 10.339, -68.743, 5.0),
    ('Instituto Municipal de la Mujer Guaaribe', 'Atiende programas de genero en San Jose de Guaribe.', 'Instituto Municipal de la Mujer Guaaribe', 'OTRA', 'Zona central urbana, San Jose de Guaribe 2323.', 'GUARICO', 'S JOSE DE GUARIBE', 'San José de Guaribe', 9.948, -65.987, NULL),
    ('MINMUJER', 'Sede ministerial que coordina politicas sectoriales en Cojedes.', 'Ministerio de la Mujer', 'MINISTERIO', 'Edificio General Manuel Manrique, San Carlos 2201.', 'COJEDES', 'SAN CARLOS', 'San Carlos de Austria', 9.661, -68.583, NULL);

DO $$
DECLARE
    total_sedes integer;
BEGIN
    SELECT count(*) INTO total_sedes
    FROM centros_suministrados c
    JOIN estados e ON upper(e.nombre) = c.estado
    JOIN municipios m ON m.estado_id = e.id AND upper(m.nombre) = c.municipio
    JOIN parroquias p ON p.municipio_id = m.id AND upper(p.nombre) = upper(c.parroquia);

    IF total_sedes <> (SELECT count(*) FROM centros_suministrados) THEN
        RAISE EXCEPTION 'No se encontraron todas las ubicaciones de centros_suministrados; revise estados, municipios y parroquias.';
    END IF;
END $$;

INSERT INTO centros_atencion (
    nombre,
    descripcion,
    organismo,
    tipo_organismo,
    direccion,
    parroquia_id,
    latitud,
    longitud,
    calificacion
)
SELECT
    c.nombre,
    c.descripcion,
    c.organismo,
    c.tipo_organismo,
    c.direccion,
    p.id,
    c.latitud,
    c.longitud,
    c.calificacion
FROM centros_suministrados c
JOIN estados e ON upper(e.nombre) = c.estado
JOIN municipios m ON m.estado_id = e.id AND upper(m.nombre) = c.municipio
JOIN parroquias p ON p.municipio_id = m.id AND upper(p.nombre) = upper(c.parroquia)
ON CONFLICT (nombre, parroquia_id) DO UPDATE SET
    descripcion = EXCLUDED.descripcion,
    organismo = EXCLUDED.organismo,
    tipo_organismo = EXCLUDED.tipo_organismo,
    direccion = EXCLUDED.direccion,
    latitud = EXCLUDED.latitud,
    longitud = EXCLUDED.longitud,
    calificacion = EXCLUDED.calificacion;

COMMIT;
