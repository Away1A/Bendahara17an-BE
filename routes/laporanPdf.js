const express = require('express');
const router = express.Router();
const controller = require('../controllers/laporanPdfController');

router.get('/', controller.generateLaporanPdf);
router.get('/download-excel', controller.downloadLaporanExcel);


module.exports = router;
