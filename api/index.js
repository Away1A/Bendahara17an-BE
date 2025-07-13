const express = require('express');
const serverless = require('serverless-http'); // ✅ hanya satu kali
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// // Routes
// app.use('/api/pemasukan', require('../routes/pemasukan'));
// app.use('/api/pengeluaran', require('../routes/pengeluaran'));
// app.use('/api/laporan', require('../routes/laporan'));
// app.use('/api/laporan-pdf', require('../routes/laporanPdf'));
// app.use('/api/auth', require('../routes/auth'));
// app.use('/api/pengajuan', require('../routes/pengajuan'));

app.get('/', (req, res) => {
  res.send('Hello from Vercel Express!');
});

module.exports = serverless(app); // ✅ export hanya di bawah
