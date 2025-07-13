const db = require("../config/db");

/* ===== CREATE ===== */
exports.create = async ({ judul, deskripsi, divisi, jumlah, userId }) => {
  await db.query(
    `INSERT INTO pengajuan (judul, deskripsi, divisi, jumlah, dibuat_oleh)
     VALUES ($1,$2,$3,$4,$5)`,
    [judul, deskripsi, divisi, jumlah, userId]
  );
};

/* ===== READ ===== */
exports.getById = async (id) => {
  const r = await db.query("SELECT * FROM pengajuan WHERE id = $1", [id]);
  return r.rows[0];
};

exports.getAll = async () => {
  const r = await db.query("SELECT * FROM pengajuan ORDER BY id DESC");
  return r.rows;
};

exports.getByStatus = async (status) => {
  const r = await db.query(
    "SELECT * FROM pengajuan WHERE status = $1 ORDER BY id DESC",
    [status]
  );
  return r.rows;
};

/* ===== UPDATE STATUS ===== */
exports.updateStatus = async (
  id,
  status,
  userId,
  roleColumn /* diperiksa_oleh, disetujui_oleh, diselesaikan_oleh */
) => {
  await db.query(
    `UPDATE pengajuan SET status=$1, ${roleColumn}=$2 WHERE id=$3`,
    [status, userId, id]
  );
};
