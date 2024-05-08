const express = require('express');
const imageController = require('../controllers/image.controller');
const authenticateJWT = require('../middleware/jwt.middleware');
const router = express.Router();
const multer = require('multer');


// Khởi tạo middleware multer để xử lý tải lên tệp
const upload = multer({ dest: 'uploads/' });

router.post('/images/upload', upload.single('image'), imageController.uploadImage);

module.exports = router;
