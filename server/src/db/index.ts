import mysql from 'mysql2/promise';
import { DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD } from '../constants';

const pool = mysql.createPool({
  host: DB_HOST,
  database: DB_NAME,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  waitForConnections: true,
});

const executeSql = async (sql: string, values?: string[]) => {
  try {
    const [rows] = await pool.execute(sql, values);
    return rows;
  } catch (err) {
    throw err;
  }
};

export { executeSql };
