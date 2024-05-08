const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { normalizeFileName } = require('../utils');
const url = require('url');


class imageController {

    async uploadImage(req, res) {
        const image = req.file;

        // Kiểm tra xem có tệp hình ảnh được tải lên không
        if (!image) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        // Kiểm tra tính hợp lệ của tệp hình ảnh
        if (!image.mimetype.startsWith('image')) {
            return res.status(400).json({ error: 'Invalid image format' });
        }

        // Lấy thông tin về tên tệp và phần mở rộng
        const { name, ext } = path.parse(image.originalname);

        // Tạo tên mới với phần random được thêm vào
        const randomString = uuidv4();
        const newFileName = `${normalizeFileName(name)}_${randomString}${ext}`;
        const targetPath = path.join(__dirname, '../public/images', newFileName);

        // Di chuyển tệp hình ảnh từ thư mục tạm sang thư mục lưu trữ cuối cùng
        try {
            await fs.promises.rename(image.path, targetPath);
            const fullUrl = url.format({
                protocol: req.protocol,
                host: req.get('host'),
                pathname: `/images/${newFileName}`
            });
            return res.json({ path: fullUrl });
        } catch (error) {
            return res.status(500).json({ error: 'Error moving file' });
        }
    }

}

module.exports = new imageController();
