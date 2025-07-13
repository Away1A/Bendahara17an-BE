const db = require('../config/db');
const bcrypt = require('bcrypt');

const createUser = async ({ username, password, role }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.query(
    `INSERT INTO users (username, password, role) VALUES ($1, $2, $3)`,
    [username, hashedPassword, role]
  );
};

const getByUsername = async (username) => {
  const result = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);
  return result.rows[0];
};

const getRoleByUsername = async (username) => {
  const result = await db.query(`SELECT role FROM users WHERE username = $1`, [username]);
  return result.rows[0]?.role || null;
};

const getAll = async () => {
  const result = await db.query(`SELECT id, username, role FROM users ORDER BY id`);
  return result.rows;
};

module.exports = { createUser, getByUsername, getRoleByUsername, getAll };
