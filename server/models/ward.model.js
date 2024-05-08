const database = require('../config/database');

async function getWardsByDistrictCode(district_code) {
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
        const [rows, fields] = await connection.query('SELECT * FROM wards WHERE district_code = ? ORDER BY name ASC', [district_code]);
        return rows;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    getWardsByDistrictCode
};