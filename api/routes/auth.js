const express = require('express');
const router = express.Router();
const controller = require('../../controllers/authController');

router.post('/login', controller.login);
router.post('/register', controller.register); // Opsional, untuk admin/manual
router.get('/users', controller.getAll); // Opsional, hanya jika kamu ingin melihat semua user

module.exports = router;
