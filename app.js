/** 1. SETUP EXPRESS NORMAL */
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

/** 2. ROUTES */
app.use('/api/pemasukan', require('../routes/pemasukan'));
app.use('/api/pengeluaran', require('../routes/pengeluaran'));
app.use('/api/laporan', require('../routes/laporan'));
app.use('/api/laporan-pdf', require('../routes/laporanPdf'));
app.use('/api/auth', require('../routes/auth'));
app.use('/api/pengajuan', require('../routes/pengajuan'));

app.get('/', (req, res) => res.send('API Bendahara 17‑an Aktif'));

/** 3. EXPORT AS SERVERLESS HANDLER */
const serverless = require('serverless-http');
module.exports = serverless(app);
