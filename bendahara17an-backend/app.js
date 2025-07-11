const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Import rute (nanti dibuat)
const pemasukanRoutes = require('./routes/pemasukan');
const pengeluaranRoutes = require('./routes/pengeluaran');
const laporanRoutes = require('./routes/laporan');
const laporanPdfRoutes = require('./routes/laporanPdf');


app.use('/api/pemasukan', pemasukanRoutes);
app.use('/api/pengeluaran', pengeluaranRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/laporan-pdf', laporanPdfRoutes);


app.get('/', (req, res) => res.send('API Bendahara 17-an Aktif'));

app.listen(PORT, () => console.log(`Server running di http://localhost:${PORT}`));
