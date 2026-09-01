import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var mysqlPool: mysql.Pool | undefined;
}

function createPool() {
  return mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
    charset: "utf8mb4",
  });
}

export function getPool() {
  if (!global.mysqlPool) {
    global.mysqlPool = createPool();
  }
  return global.mysqlPool;
}

export async function query<T = any>(sql: string, params?: any): Promise<T[]> {
  const [rows] = params
    ? await getPool().execute(sql, params)
    : await getPool().query(sql);
  return rows as T[];
}
