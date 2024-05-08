const express = require('express');
const authController = require('../controllers/auth.controller');
const authenticateJWT = require('../middleware/jwt.middleware');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/info', authenticateJWT(), authController.info);

module.exports = router;
