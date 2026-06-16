import query from "../database/postgre.js";

export const saveAbout = async (request, reply) => {
  const payload = request.body;
  const client = await query('BEGIN');
  try {
    // Get existing institucion id (assume single row)
    const resExist = await query('SELECT id FROM institucion LIMIT 1');
    let institucionId;
    if (resExist.rows && resExist.rows.length > 0) {
      institucionId = resExist.rows[0].id;
      await query(
        `UPDATE institucion SET nombre=$1, nombre_corto=$2, fecha_creacion=$3, ley_creacion=$4, descripcion=$5, vision=$6, mision=$7, created_at=COALESCE(created_at, NOW()) WHERE id=$8`,
        [payload.nombre, payload.nombreCorto, payload.fechaCreacion, payload.leyCreacion, payload.descripcion, payload.vision, payload.mision, institucionId]
      );
    } else {
      const insertRes = await query(
        `INSERT INTO institucion (nombre, nombre_corto, fecha_creacion, ley_creacion, descripcion, vision, mision) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
        [payload.nombre, payload.nombreCorto, payload.fechaCreacion, payload.leyCreacion, payload.descripcion, payload.vision, payload.mision]
      );
      institucionId = insertRes.rows[0].id;
    }

    // Clear related tables for this institucion
    await query('DELETE FROM institucion_valores WHERE institucion_id=$1', [institucionId]);
    await query('DELETE FROM institucion_logros WHERE institucion_id=$1', [institucionId]);
    await query('DELETE FROM institucion_aliados WHERE institucion_id=$1', [institucionId]);
    await query('DELETE FROM institucion_contacto WHERE institucion_id=$1', [institucionId]);
    await query('DELETE FROM institucion_redes WHERE institucion_id=$1', [institucionId]);

    // Insert valores
    if (Array.isArray(payload.valores)) {
      for (let i = 0; i < payload.valores.length; i++) {
        const v = payload.valores[i];
        await query('INSERT INTO institucion_valores (institucion_id, titulo, descripcion, icono, orden) VALUES ($1,$2,$3,$4,$5)', [institucionId, v.titulo, v.descripcion, v.icono, i + 1]);
      }
    }

    // Insert logros
    if (Array.isArray(payload.logros)) {
      for (let i = 0; i < payload.logros.length; i++) {
        const l = payload.logros[i];
        await query('INSERT INTO institucion_logros (institucion_id, numero, titulo, descripcion, orden) VALUES ($1,$2,$3,$4,$5)', [institucionId, l.numero, l.titulo, l.descripcion, i + 1]);
      }
    }

    // Aliados
    if (Array.isArray(payload.aliados)) {
      for (const a of payload.aliados) {
        await query('INSERT INTO institucion_aliados (institucion_id, nombre, tipo) VALUES ($1,$2,$3)', [institucionId, a.nombre, a.tipo]);
      }
    }

    // Contacto (single)
    if (payload.contacto) {
      await query('INSERT INTO institucion_contacto (institucion_id, direccion, telefono, correo, horario) VALUES ($1,$2,$3,$4,$5)', [institucionId, payload.contacto.direccion, payload.contacto.telefono, payload.contacto.correo, payload.contacto.horario]);
    }

    // Redes
    if (Array.isArray(payload.redes)) {
      for (const r of payload.redes) {
        await query('INSERT INTO institucion_redes (institucion_id, nombre, url) VALUES ($1,$2,$3)', [institucionId, r.nombre, r.url]);
      }
    }

    // Commit
    await query('COMMIT');
    return reply.code(200).send({ ok: true });
  } catch (err) {
    await query('ROLLBACK');
    request.log.error(err);
    console.log(err);

    return reply.code(500).send({ error: 'Error saving institucion' });
  }
};

export const getAbout = async (request, reply) => {
  try {
    const res = await query('SELECT * FROM institucion LIMIT 1');
    if (!res.rows || res.rows.length === 0) return reply.code(404).send({});
    const inst = res.rows[0];
    const valores = (await query('SELECT titulo, descripcion, icono, orden FROM institucion_valores WHERE institucion_id=$1 ORDER BY orden', [inst.id])).rows;
    const logros = (await query('SELECT numero, titulo, descripcion, orden FROM institucion_logros WHERE institucion_id=$1 ORDER BY orden', [inst.id])).rows;
    const aliados = (await query('SELECT nombre, tipo FROM institucion_aliados WHERE institucion_id=$1', [inst.id])).rows;
    const contacto = (await query('SELECT direccion, telefono, correo, horario FROM institucion_contacto WHERE institucion_id=$1 LIMIT 1', [inst.id])).rows[0] || {};
    const redes = (await query('SELECT nombre, url FROM institucion_redes WHERE institucion_id=$1', [inst.id])).rows;
    return reply.code(200).send({ ...inst, valores, logros, aliados, contacto, redes });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ error: 'Error fetching institucion' });
  }
};
