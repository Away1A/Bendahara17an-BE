const express = require('express');
const router = express.Router();
const controller = require('../../controllers/laporanController');

router.get('/summary', controller.getSummary);
router.get('/rekap', controller.getRekap);


module.exports = router;
