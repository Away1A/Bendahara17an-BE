const model = require('../models/pemasukanModel');

exports.getAll = async (req, res) => {
  try {
    const data = await model.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await model.getById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    await model.create(req.body);
    res.status(201).json({ message: 'Pemasukan berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await model.update(req.params.id, req.body);
    res.json({ message: 'Pemasukan berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await model.remove(req.params.id);
    res.json({ message: 'Pemasukan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
