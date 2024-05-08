const database = require('../config/database');

async function getDistrictsByProvinceCode(province_code) {
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
        const [rows, fields] = await connection.query('SELECT * FROM districts WHERE province_code = ? ORDER BY name ASC', [province_code]);
        return rows;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    getDistrictsByProvinceCode
};