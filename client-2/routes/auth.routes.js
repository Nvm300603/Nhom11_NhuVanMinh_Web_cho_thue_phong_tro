const express = require('express');
const authController = require('../controllers/auth.controller');
const authenticateJWT = require('../middleware/jwt.middleware');
const router = express.Router();


router.get('/register', authController.register_view);
router.get('/login', authController.login_view);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;
