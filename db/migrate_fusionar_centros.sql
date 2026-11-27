-- ============================================================================
-- Migración 2: fusión de registros DIRECTORIO duplicados
-- Dev: asistente | Fecha: 2026-11-27
--
-- Los 133 registros de directorio contienen sedes repetidas (misma dirección,
-- coordenadas y municipio) que representan el mismo centro con varias
-- defensoras. Esta migración:
--   1. Elige un centro representativo por grupo (municipio + parroquia +
--      dirección normalizada).
--   2. Mueve servicios, responsables, redes, requisitos y defensoras al
--      representante.
--   3. Marca los duplicados como eliminados (soft-delete) con fecha, sin borrar
--      nada de la base de datos.
--
-- Es idempotente: si se vuelve a ejecutar no vuelve a fusionar nada.
-- ============================================================================

BEGIN;

DO $$
DECLARE
    representante integer;
    fusionados integer := 0;
    grupo record;
BEGIN
    FOR grupo IN
        SELECT
            m.id AS municipio_id,
            COALESCE(c.parroquia_id, 0) AS parroquia_id,
            LOWER(BTRIM(c.direccion)) AS direccion_norma,
            MIN(c.id) AS centro_id
        FROM centros c
        JOIN municipios m ON m.id = c.municipio_id
        WHERE c.tipo_registro = 'DIRECTORIO'
          AND c.eliminado = false
        GROUP BY m.id, COALESCE(c.parroquia_id, 0), LOWER(BTRIM(c.direccion))
        HAVING COUNT(*) > 1
    LOOP
        representante := grupo.centro_id;

        -- Mover defensoras al representante (sin duplicar correos ya presentes)
        INSERT INTO defensoras (centro_id, correo, telefono, created_at)
        SELECT representante, d.correo, d.telefono, d.created_at
        FROM defensoras d
        JOIN centros c2 ON c2.id = d.centro_id
        WHERE d.eliminado = false
          AND d.centro_id <> representante
          AND c2.tipo_registro = 'DIRECTORIO'
          AND c2.eliminado = false
          AND c2.municipio_id = grupo.municipio_id
          AND COALESCE(c2.parroquia_id, 0) = grupo.parroquia_id
          AND LOWER(BTRIM(c2.direccion)) = grupo.direccion_norma
          AND NOT EXISTS (
            SELECT 1 FROM defensoras dx
            WHERE dx.centro_id = representante
              AND dx.eliminado = false
              AND (
                (dx.correo IS NOT NULL AND d.correo IS NOT NULL AND LOWER(TRIM(dx.correo)) = LOWER(TRIM(d.correo)))
                OR (dx.telefono IS NOT NULL AND d.telefono IS NOT NULL
                    AND REGEXP_REPLACE(dx.telefono, '\D', '', 'g') = REGEXP_REPLACE(d.telefono, '\D', '', 'g'))
              )
          );

        -- Mover servicios, responsables, redes y requisitos que falten
        INSERT INTO servicios_centro (centro_id, servicio)
        SELECT representante, s.servicio
        FROM servicios_centro s
        JOIN centros c2 ON c2.id = s.centro_id
        WHERE s.centro_id <> representante
          AND c2.municipio_id = grupo.municipio_id
          AND COALESCE(c2.parroquia_id, 0) = grupo.parroquia_id
          AND LOWER(BTRIM(c2.direccion)) = grupo.direccion_norma
          AND c2.tipo_registro = 'DIRECTORIO'
          AND NOT EXISTS (
            SELECT 1 FROM servicios_centro sx
            WHERE sx.centro_id = representante AND LOWER(TRIM(sx.servicio)) = LOWER(TRIM(s.servicio))
          );

        INSERT INTO redes_centro (centro_id, nombre, url, icono)
        SELECT representante, r.nombre, r.url, r.icono
        FROM redes_centro r
        JOIN centros c2 ON c2.id = r.centro_id
        WHERE r.centro_id <> representante
          AND c2.municipio_id = grupo.municipio_id
          AND COALESCE(c2.parroquia_id, 0) = grupo.parroquia_id
          AND LOWER(BTRIM(c2.direccion)) = grupo.direccion_norma
          AND c2.tipo_registro = 'DIRECTORIO'
          AND NOT EXISTS (
            SELECT 1 FROM redes_centro rx
            WHERE rx.centro_id = representante AND LOWER(TRIM(rx.nombre)) = LOWER(TRIM(r.nombre))
          );

        INSERT INTO requisitos_centro (centro_id, requisito)
        SELECT representante, q.requisito
        FROM requisitos_centro q
        JOIN centros c2 ON c2.id = q.centro_id
        WHERE q.centro_id <> representante
          AND c2.municipio_id = grupo.municipio_id
          AND COALESCE(c2.parroquia_id, 0) = grupo.parroquia_id
          AND LOWER(BTRIM(c2.direccion)) = grupo.direccion_norma
          AND c2.tipo_registro = 'DIRECTORIO'
          AND NOT EXISTS (
            SELECT 1 FROM requisitos_centro qx
            WHERE qx.centro_id = representante AND LOWER(TRIM(qx.requisito)) = LOWER(TRIM(q.requisito))
          );

        -- Fusionar responsables (directora) si el representante no tiene
        IF NOT EXISTS (SELECT 1 FROM responsables_centro WHERE centro_id = representante) THEN
            INSERT INTO responsables_centro (centro_id, nombre, cargo)
            SELECT representante, r.nombre, r.cargo
            FROM responsables_centro r
            JOIN centros c2 ON c2.id = r.centro_id
            WHERE c2.municipio_id = grupo.municipio_id
              AND COALESCE(c2.parroquia_id, 0) = grupo.parroquia_id
              AND LOWER(BTRIM(c2.direccion)) = grupo.direccion_norma
              AND c2.tipo_registro = 'DIRECTORIO'
            LIMIT 1;
        END IF;

        -- Completar datos del representante con lo que falte de los duplicados
        UPDATE centros rep SET
            descripcion = COALESCE(NULLIF(rep.descripcion, ''), dup.descripcion),
            organismo   = COALESCE(NULLIF(BTRIM(rep.organismo), ''), dup.organismo),
            foto        = COALESCE(rep.foto, dup.foto),
            foto2       = COALESCE(rep.foto2, dup.foto2),
            horario     = COALESCE(rep.horario, dup.horario),
            latitud     = COALESCE(rep.latitud, dup.latitud),
            longitud    = COALESCE(rep.longitud, dup.longitud)
        FROM centros dup
        WHERE rep.id = representante
          AND dup.id <> representante
          AND dup.municipio_id = grupo.municipio_id
          AND COALESCE(dup.parroquia_id, 0) = grupo.parroquia_id
          AND LOWER(BTRIM(dup.direccion)) = grupo.direccion_norma
          AND dup.tipo_registro = 'DIRECTORIO';

        -- Soft-delete de los duplicados
        UPDATE centros c2
        SET eliminado = true, eliminado_en = NOW()
        WHERE c2.tipo_registro = 'DIRECTORIO'
          AND c2.eliminado = false
          AND c2.id <> representante
          AND c2.municipio_id = grupo.municipio_id
          AND COALESCE(c2.parroquia_id, 0) = grupo.parroquia_id
          AND LOWER(BTRIM(c2.direccion)) = grupo.direccion_norma;

        GET DIAGNOSTICS fusionados = ROW_COUNT;
    END LOOP;

    RAISE NOTICE 'Registros fusionados (soft-deleted): %', fusionados;
END $$;

COMMIT;