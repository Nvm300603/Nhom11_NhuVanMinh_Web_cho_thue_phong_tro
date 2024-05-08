const removeDiacritics = require('remove-diacritics');

function createSlugFromTitle(title) {
    // Chuyển đổi tiếng Việt có dấu sang không dấu
    const titleWithoutDiacritics = removeDiacritics(title);
    // Xóa các ký tự không mong muốn, chuyển thành chữ thường, và thay dấu cách bằng dấu gạch ngang
    return titleWithoutDiacritics.trim().toLowerCase().replace(/\s+/g, '-');
}
function normalizeFileName(fileName) {
    // Loại bỏ ký tự đặc biệt
    fileName = fileName.replace(/[^a-zA-Z0-9.\-\s]/g, '');

    // Thay thế khoảng trắng và dấu gạch ngang bằng dấu gạch dưới
    fileName = fileName.replace(/ /g, '_');
    fileName = fileName.replace(/-/g, '_');

    return fileName;
}

module.exports = { createSlugFromTitle, normalizeFileName };