const path = require("path");
const fs = require("fs/promises");
const puppeteer = require("puppeteer");
const moment = require("moment");
const axios = require("axios");

const formatRupiah = (val) => {
  return parseInt(val || 0).toLocaleString("id-ID");
};

const ExcelJS = require("exceljs");

exports.downloadLaporanExcel = async (req, res) => {
  const { start_date, end_date } = req.query;

  try {
    const [pemasukanRes, pengeluaranRes, summaryRes] = await Promise.all([
      axios.get("http://localhost:3001/api/pemasukan",   { params: { start_date, end_date } }),
      axios.get("http://localhost:3001/api/pengeluaran", { params: { start_date, end_date } }),
      axios.get("http://localhost:3001/api/laporan/summary", { params: { start_date, end_date } }),
    ]);

    const pemasukan   = pemasukanRes.data   || [];
    const pengeluaran = pengeluaranRes.data || [];
    const summary     = summaryRes.data;

    const wb = new ExcelJS.Workbook();

    /* ---------- GLOBAL THEME ---------- */
    const theme = {
      primary     : 'FF1E3A8A', // biru tua elegan
      secondary   : 'FFF8F9FB', // hampir putih—latar dasar
      accent      : 'FFFFD166', // emas lembut—aksen
      headerFill  : 'FF27408B',
      altRowFill  : 'FFE7ECFF',
      text        : { size: 11, name: 'Calibri' }
    };

    /* ---------- WORKSHEET ---------- */
    const ws = wb.addWorksheet("Laporan Keuangan", {
      properties : { defaultRowHeight: 22 },
      pageSetup  : { fitToPage: true, fitToWidth: 1, orientation: 'landscape' }
    });

    /* ---------- JUDUL & PERIODE ---------- */
    ws.mergeCells("A1:K1");
    ws.getCell("A1").value = "LAPORAN KEUANGAN PANITIA 17 AGUSTUS";
    ws.getCell("A1").font  = { ...theme.text, size: 16, bold: true, color: { argb: theme.primary } };
    ws.getCell("A1").alignment = { horizontal: 'center' };

    ws.mergeCells("A2:K2");
    ws.getCell("A2").value = `Periode: ${start_date} s.d. ${end_date}`;
    ws.getCell("A2").font  = { ...theme.text, italic: true };
    ws.getCell("A2").alignment = { horizontal: 'center' };

    ws.addRow([]);

    /* ---------- RINGKASAN KEUANGAN ---------- */
    const boxStyle = {
      border: { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} },
      fill  : { type:'pattern', pattern:'solid', fgColor:{ argb: theme.secondary } }
    };

    const summaryTable = [
      ['Total Pemasukan',  summary.total_pemasukan ],
      ['Total Pengeluaran',summary.total_pengeluaran],
      ['Saldo Akhir',      summary.saldo           ]
    ];

    summaryTable.forEach(([label, value]) => {
      const row = ws.addRow([label, value]);
      row.getCell(1).font = { ...theme.text, bold: true };
      row.getCell(2).numFmt = '#,##0';
      row.eachCell((c)=>Object.assign(c, boxStyle));
    });

    ws.addRow([]);
    ws.addRow([]);

    /* ---------- JUDUL TABEL PEMASUKAN/PENGELUARAN ---------- */
    ws.mergeCells("A8:E8");
    ws.getCell("A8").value = "📈 PEMASUKAN";
    ws.getCell("A8").font  = { ...theme.text, bold:true, color:{argb:theme.headerFill}, size: 12 };

    ws.mergeCells("G8:K8");
    ws.getCell("G8").value = "📉 PENGELUARAN";
    ws.getCell("G8").font  = { ...theme.text, bold:true, color:{argb:theme.headerFill}, size: 12 };

    /* ---------- HEADER KOLOM ---------- */
    const pemasukanHeader   = ["Tanggal","Kategori","Sumber","Jumlah","Metode"];
    const pengeluaranHeader = ["Tanggal","Kategori","Keperluan","Jumlah","Metode"];
    ws.addRow([...pemasukanHeader, "", ...pengeluaranHeader]);

    const headerRow = ws.lastRow;
    headerRow.height = 26;
    headerRow.eachCell((cell) => {
      cell.font      = { ...theme.text, bold: true, color:{ argb:'FFFFFFFF' }};
      cell.alignment = { horizontal:'center', vertical:'middle' };
      cell.fill      = { type:'pattern', pattern:'solid', fgColor:{ argb: theme.headerFill }};
      cell.border    = { top:{style:'thin'}, left:{style:'thin'},
                         bottom:{style:'thin'}, right:{style:'thin'} };
    });

    /* ---------- DATA ROWS ---------- */
    const maxRows = Math.max(pemasukan.length, pengeluaran.length);
    for (let i = 0; i < maxRows; i++) {
      const p = pemasukan[i]   || {};
      const q = pengeluaran[i] || {};

      const row = ws.addRow([
        p.tanggal   ? moment(p.tanggal).format("DD-MM-YYYY") : "",
        p.kategori  || "", p.sumber     || "",
        p.jumlah    || "", p.keterangan || "", "",
        q.tanggal   ? moment(q.tanggal).format("DD-MM-YYYY") : "",
        q.kategori  || "", q.keperluan  || "",
        q.jumlah    || "", q.keterangan || ""
      ]);

      /* --- Zebra Striping untuk keterbacaan --- */
      if (i % 2 === 0) {
        row.eachCell((c)=>{ c.fill = { type:'pattern', pattern:'solid',
                                       fgColor:{ argb: theme.altRowFill }}; });
      }

      /* --- Format angka --- */
      row.getCell(4).numFmt  = '#,##0';
      row.getCell(10).numFmt = '#,##0';
    }

    /* ---------- STYLING KOLOM & BORDER ---------- */
    const dataStart = 9, dataEnd = ws.lastRow.number;
    for (let r = dataStart; r <= dataEnd; r++) {
      /* kiri tabel */
      for (let c = 1; c <= 5; c++) {
        const cell = ws.getCell(r,c);
        cell.border = { top:{style:'thin'}, left:{style:'thin'},
                        bottom:{style:'thin'}, right:{style:'thin'} };
      }
      /* kanan tabel */
      for (let c = 7; c <= 11; c++) {
        const cell = ws.getCell(r,c);
        cell.border = { top:{style:'thin'}, left:{style:'thin'},
                        bottom:{style:'thin'}, right:{style:'thin'} };
      }
    }

    /* ---------- LEBAR KOLOM ---------- */
    const widths = [16, 24, 30, 20, 20, 4, 16, 24, 32, 20, 20];
    ws.columns.forEach((col,i)=>{ col.width = widths[i] || 14; });

    /* ---------- FITUR TAMBAHAN ---------- */
    ws.views = [{ state:'frozen', ySplit:8 }];     // freeze header & judul
    ws.autoFilter = { from:'A8', to:'K8' };        // aktifkan filter

    /* ---------- OUTPUT ---------- */
    const buffer = await wb.xlsx.writeBuffer();
    res.setHeader("Content-Disposition",
        `attachment; filename="laporan-keuangan-${start_date}_sd_${end_date}.xlsx"`);
    res.setHeader("Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);

  } catch (err) {
    console.error("Gagal unduh Excel:", err.message);
    res.status(500).json({ error: "Gagal unduh data Excel" });
  }
};



exports.generateLaporanPdf = async (req, res) => {
  const { start_date, end_date } = req.query;

  try {
    // 1. Ambil data dari API internal
    const [rekapRes, summaryRes] = await Promise.all([
      axios.get(`http://localhost:3001/api/laporan/rekap`, { params: { start_date, end_date } }),
      axios.get(`http://localhost:3001/api/laporan/summary`, { params: { start_date, end_date } }),
    ]);

    const rekap = rekapRes.data;
    const summary = summaryRes.data;

    // 2. Gabungkan semua kategori unik dari pemasukan & pengeluaran
    const kategoriSet = new Set();

    rekap.rekap_pemasukan.forEach((item) => kategoriSet.add(item.kategori || "Lainnya"));
    rekap.rekap_pengeluaran.forEach((item) => kategoriSet.add(item.kategori || "Lainnya"));

    const kategoriList = Array.from(kategoriSet);

    // 3. Buat mapping jumlah berdasarkan kategori
    const pemasukanMap = {};
    const pengeluaranMap = {};

    rekap.rekap_pemasukan.forEach((item) => {
      const kategori = item.kategori || "Lainnya";
      pemasukanMap[kategori] = item.total;
    });

    rekap.rekap_pengeluaran.forEach((item) => {
      const kategori = item.kategori || "Lainnya";
      pengeluaranMap[kategori] = item.total;
    });

    const dataPemasukan = kategoriList.map((k) => pemasukanMap[k] || 0);
    const dataPengeluaran = kategoriList.map((k) => pengeluaranMap[k] || 0);

    // 4. Baca template HTML
    const htmlPath = path.join(__dirname, "../views/laporan-template.html");
    let html = await fs.readFile(htmlPath, "utf-8");

    // 5. Replace ringkasan keuangan
    html = html.replace("{{periode}}", `${start_date} s.d. ${end_date}`);
    html = html.replace("{{total_pemasukan}}", formatRupiah(summary.total_pemasukan));
    html = html.replace("{{total_pengeluaran}}", formatRupiah(summary.total_pengeluaran));
    html = html.replace("{{saldo}}", formatRupiah(summary.saldo));
    html = html.replace("{{tanggal_cetak}}", moment().format("DD MMMM YYYY"));

    // 6. Replace data grafik
    html = html.replace("{{label_kategori}}", JSON.stringify(kategoriList));
    html = html.replace("{{data_pemasukan}}", JSON.stringify(dataPemasukan));
    html = html.replace("{{data_pengeluaran}}", JSON.stringify(dataPengeluaran));

    // 7. Generate tabel pemasukan
    const pemasukanTable = rekap.rekap_pemasukan.map((item, i) => (
      `<tr><td>${i + 1}</td><td>${item.kategori || "Lainnya"}</td><td class="right">Rp ${formatRupiah(item.total)}</td></tr>`
    )).join("\n");

    html = html.replace("{{table_pemasukan}}", pemasukanTable || `<tr><td colspan="3">Tidak ada data</td></tr>`);

    // 8. Generate tabel pengeluaran
    const pengeluaranTable = rekap.rekap_pengeluaran.map((item, i) => (
      `<tr><td>${i + 1}</td><td>${item.kategori || "Lainnya"}</td><td class="right">Rp ${formatRupiah(item.total)}</td></tr>`
    )).join("\n");

    html = html.replace("{{table_pengeluaran}}", pengeluaranTable || `<tr><td colspan="3">Tidak ada data</td></tr>`);

    // 9. Generate PDF via Puppeteer
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Jika pakai grafik Chart.js, tunggu render:
    await page.waitForFunction('window.chartRendered === true', { timeout: 3000 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
    });

    await browser.close();

    // 10. Kirim hasil
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="laporan-keuangan.pdf"`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Gagal generate PDF:", error);
    res.status(500).json({ error: "Gagal generate PDF" });
  }
};
