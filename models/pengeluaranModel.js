const db = require('../config/db');

const getAll = async () => {
  const result = await db.query('SELECT * FROM pengeluaran ORDER BY tanggal DESC');
  return result.rows;
};

const getById = async (id) => {
  const result = await db.query('SELECT * FROM pengeluaran WHERE id = $1', [id]);
  return result.rows[0];
};

const create = async (data) => {
  const { tanggal, keperluan, kategori, jumlah, keterangan } = data;
  await db.query(
    `INSERT INTO pengeluaran (tanggal, keperluan, kategori, jumlah, keterangan) 
     VALUES ($1, $2, $3, $4, $5)`,
    [tanggal, keperluan, kategori, jumlah, keterangan]
  );
};

const update = async (id, data) => {
  const { tanggal, keperluan, kategori, jumlah, keterangan } = data;
  await db.query(
    `UPDATE pengeluaran SET tanggal=$1, keperluan=$2, kategori=$3, jumlah=$4, keterangan=$5 WHERE id=$6`,
    [tanggal, keperluan, kategori, jumlah, keterangan, id]
  );
};

const remove = async (id) => {
  await db.query('DELETE FROM pengeluaran WHERE id = $1', [id]);
};

module.exports = { getAll, getById, create, update, remove };
