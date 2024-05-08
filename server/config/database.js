const mysql = require('mysql2/promise');
const mysqlConfig = require('./mysql.config');

let pool = null;

async function createPool() {
    pool = mysql.createPool(mysqlConfig);
}

function getPool() {
    if (!pool) {
        throw new Error('MySQL connection pool has not been initialized.');
    }
    return pool;
}

module.exports = { createPool, getPool };
