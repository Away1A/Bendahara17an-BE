const model = require('../models/laporanModel');

exports.getSummary = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const [masuk, keluar] = await Promise.all([
      model.getTotalPemasukan(start_date, end_date),
      model.getTotalPengeluaran(start_date, end_date),
    ]);

    const saldo = masuk - keluar;

    res.json({
      total_pemasukan: masuk,
      total_pengeluaran: keluar,
      saldo,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRekap = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const [masuk, keluar] = await Promise.all([
      model.getRekapKategoriPemasukan(start_date, end_date),
      model.getRekapKategoriPengeluaran(start_date, end_date),
    ]);

    res.json({
      rekap_pemasukan: masuk,
      rekap_pengeluaran: keluar,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getData = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const [pemasukan, pengeluaran] = await Promise.all([
      model.getDataPemasukan(start_date, end_date),
      model.getDataPengeluaran(start_date, end_date),
    ]);

    res.json({
      pemasukan,
      pengeluaran,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
