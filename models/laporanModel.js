const db = require('../config/db');

// Fungsi bantu membuat klausa WHERE dan parameter
const buildDateFilter = (start, end) => {
  if (start && end) {
    return {
      clause: `WHERE tanggal BETWEEN $1 AND $2`,
      values: [start, end],
    };
  }
  return { clause: '', values: [] };
};

const getTotalPemasukan = async (start, end) => {
  const { clause, values } = buildDateFilter(start, end);
  const result = await db.query(
    `SELECT COALESCE(SUM(jumlah), 0) AS total FROM pemasukan ${clause}`,
    values
  );
  return parseInt(result.rows[0].total);
};

const getTotalPengeluaran = async (start, end) => {
  const { clause, values } = buildDateFilter(start, end);
  const result = await db.query(
    `SELECT COALESCE(SUM(jumlah), 0) AS total FROM pengeluaran ${clause}`,
    values
  );
  return parseInt(result.rows[0].total);
};

const getRekapKategoriPemasukan = async (start, end) => {
  const { clause, values } = buildDateFilter(start, end);
  const result = await db.query(
    `SELECT kategori, COALESCE(SUM(jumlah), 0) AS total
     FROM pemasukan
     ${clause}
     GROUP BY kategori
     ORDER BY total DESC`,
    values
  );
  return result.rows;
};

const getRekapKategoriPengeluaran = async (start, end) => {
  const { clause, values } = buildDateFilter(start, end);
  const result = await db.query(
    `SELECT kategori, COALESCE(SUM(jumlah), 0) AS total
     FROM pengeluaran
     ${clause}
     GROUP BY kategori
     ORDER BY total DESC`,
    values
  );
  return result.rows;
};

module.exports = {
  getTotalPemasukan,
  getTotalPengeluaran,
  getRekapKategoriPemasukan,
  getRekapKategoriPengeluaran,
};
