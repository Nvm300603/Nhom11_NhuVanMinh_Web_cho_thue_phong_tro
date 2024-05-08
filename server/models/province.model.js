const database = require('../config/database');

async function getProvinces() {
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
        const [rows, fields] = await connection.query('SELECT * FROM provinces ORDER BY name ASC');
        return rows;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    getProvinces
};