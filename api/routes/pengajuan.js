const express = require("express");
const router = express.Router();
const c = require("../../controllers/pengajuanController");
const { verifyToken } = require("../../middlewares/authMiddleware");
const { authorizeRole } = require("../../middlewares/roleMiddleware");

/* Maker */
router.post(
  "/",
  verifyToken,
  authorizeRole(["maker", "admin"]),
  c.createPengajuan
);

/* Checker */
router.patch(
  "/send/:id",
  verifyToken,
  authorizeRole(["checker"]),
  c.sendToApprove
);

/* Approver */
router.patch(
  "/approve/:id",
  verifyToken,
  authorizeRole(["approver"]),
  c.approve
);

/* Admin set done */
router.patch(
  "/done/:id",
  verifyToken,
  authorizeRole(["admin"]),
  c.setDone
);

/* List by status (all roles yang berwenang) */
router.get(
  "/status/:status",
  verifyToken,
  authorizeRole(["maker", "checker", "approver", "admin"]),
  c.listByStatus
);

/* Admin sees all */
router.get(
  "/all",
  verifyToken,
  authorizeRole(["admin"]),
  c.listAll
);

module.exports = router;
