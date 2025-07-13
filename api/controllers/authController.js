const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-default';

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1️⃣ Cari user di DB
    const user = await userModel.getByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Username atau password salah (user tidak ditemukan)' });
    }

    // 2️⃣ Verifikasi password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Username atau password salah (password tidak cocok)' });
    }

    // 3️⃣ Buat token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 4️⃣ Kirim token + role
    res.json({
      token,
      role: user.role,          // ⬅️ kirim role di sini
      user: { id: user.id, username: user.username }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};


exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    await userModel.createUser({ username, password, role });
    res.json({ message: 'User berhasil dibuat' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  const users = await userModel.getAll();
  res.json(users);
};
