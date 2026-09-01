import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const pool = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
if (!email || !password) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD");
  process.exit(1);
}

const [rows] = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);
if (rows.length) {
  console.log("Admin already exists");
} else {
  const hash = await bcrypt.hash(password, 12);
  await pool.execute(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')",
    ["Admin", email, hash]
  );
  console.log("Admin created:", email);
}

await pool.end();
