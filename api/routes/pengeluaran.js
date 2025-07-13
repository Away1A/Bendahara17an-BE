const express = require('express');
const router = express.Router();
const controller = require('../../controllers/pengeluaranController');
const { verifyToken } = require('../../middlewares/authMiddleware');
const { authorizeRole } = require('../../middlewares/roleMiddleware');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', verifyToken, authorizeRole(['admin']), controller.create);
router.put('/:id', verifyToken, authorizeRole(['admin']), controller.update);
router.delete('/:id', verifyToken, authorizeRole(['admin']), controller.remove);

module.exports = router;
