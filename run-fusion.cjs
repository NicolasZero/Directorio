// Ejecutar migración de fusión y verificar conteos
const fs = require('fs');
const { Client } = require('C:/Users/Marco Quintana/Documents/Trabajo inamujer/Proyectos_Inamujer/Directorio/apps/api/node_modules/pg');

(async () => {
  const c = new Client({ host: 'localhost', user: 'postgres', password: '123456', database: 'db' });
  await c.connect();
  const sql = fs.readFileSync('C:/Users/Marco Quintana/Documents/Trabajo inamujer/Proyectos_Inamujer/Directorio/db/migrate_fusionar_centros.sql', 'utf8');
  try {
    await c.query(sql);
    console.log('MIGRACION FUSION OK');
  } catch (e) {
    console.error('ERROR MIGRACION:', e.message);
    process.exit(1);
  }
  const r1 = await c.query("SELECT COUNT(*)::int AS n FROM centros WHERE tipo_registro='DIRECTORIO' AND eliminado=false");
  console.log('centros activos tras fusion:', r1.rows[0].n);
  const r2 = await c.query('SELECT COUNT(*)::int AS n FROM defensoras WHERE eliminado=false');
  console.log('defensoras activas:', r2.rows[0].n);
  await c.end();
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
