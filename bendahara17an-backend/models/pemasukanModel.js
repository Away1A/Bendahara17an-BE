const db = require('../config/db');

const getAll = async () => {
  const result = await db.query('SELECT * FROM pemasukan ORDER BY tanggal DESC');
  return result.rows;
};

const getById = async (id) => {
  const result = await db.query('SELECT * FROM pemasukan WHERE id = $1', [id]);
  return result.rows[0];
};

const create = async (data) => {
  const { tanggal, sumber, kategori, jumlah, keterangan } = data;
  await db.query(
    `INSERT INTO pemasukan (tanggal, sumber, kategori, jumlah, keterangan) 
     VALUES ($1, $2, $3, $4, $5)`,
    [tanggal, sumber, kategori, jumlah, keterangan]
  );
};

const update = async (id, data) => {
  const { tanggal, sumber, kategori, jumlah, keterangan } = data;
  await db.query(
    `UPDATE pemasukan SET tanggal=$1, sumber=$2, kategori=$3, jumlah=$4, keterangan=$5 WHERE id=$6`,
    [tanggal, sumber, kategori, jumlah, keterangan, id]
  );
};

const remove = async (id) => {
  await db.query('DELETE FROM pemasukan WHERE id = $1', [id]);
};

module.exports = { getAll, getById, create, update, remove };
