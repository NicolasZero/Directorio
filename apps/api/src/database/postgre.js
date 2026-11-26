import { Pool } from "pg";

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT
} = process.env

const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
})

const query = async (text, params, callback) => {
  return pool.query(text, params, callback);
}

export const withTransaction = async (operation) => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    const result = await operation(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    try {
      await client.query('ROLLBACK')
    } catch (rollbackError) {
      console.error('No se pudo revertir la transacción de PostgreSQL:', rollbackError)
    }
    throw error
  } finally {
    client.release()
  }
}

export default query