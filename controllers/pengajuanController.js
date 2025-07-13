const model = require("../models/pengajuanModel");

/* ------------- MAKER ------------- */
exports.createPengajuan = async (req, res) => {
  try {
    const { judul, deskripsi, divisi, jumlah } = req.body;
    const userId = req.user.id; // didapat via middleware auth
    await model.create({ judul, deskripsi, divisi, jumlah, userId });
    res.status(201).json({ message: "Pengajuan berhasil dibuat" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------- LISTING ------------- */
exports.listByStatus = async (req, res) => {
  try {
    const { status } = req.params; // submitted / checking / approved / rejected / done
    const rows = await model.getByStatus(status);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listAll = async (_req, res) => {
  try {
    const rows = await model.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------- CHECKER ------------- */
exports.sendToApprove = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // checker id
    await model.updateStatus(id, "checking", userId, "diperiksa_oleh");
    res.json({ message: "Pengajuan dikirim ke approver" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------- APPROVER ------------- */
exports.approve = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'approved' | 'rejected'
    const userId = req.user.id; // approver id
    if (!["approved", "rejected"].includes(action))
      return res.status(400).json({ error: "Aksi tidak valid" });

    await model.updateStatus(id, action, userId, "disetujui_oleh");
    res.json({ message: `Pengajuan ${action}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------- ADMIN ------------- */
exports.setDone = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // admin id
    await model.updateStatus(id, "done", userId, "diselesaikan_oleh");
    res.json({ message: "Pengajuan selesai (done)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
