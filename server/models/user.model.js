const database = require('../config/database');
const bcrypt = require("bcrypt");

async function getUsers() {
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
        const [rows, fields] = await connection.query('SELECT * FROM users');
        return rows;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

async function getUserById(userId) {
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
        const [rows, fields] = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
        return rows[0];
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

async function getUserByPhoneNumber(phoneNumber) {
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
        const [rows, fields] = await connection.query('SELECT * FROM users WHERE phone_number = ?', [phoneNumber]);
        return rows[0];
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

async function getUserByEmail(email) {
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
        const [rows, fields] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

async function createUser(userData) {
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
        const { phone_number, password, email, name, role } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.query('INSERT INTO users (phone_number, password, email, name, role) VALUES (?, ?, ?, ?, ?)', [phone_number, hashedPassword, email, name, role]);
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    getUsers,
    getUserById,
    getUserByPhoneNumber,
    getUserByEmail,
    createUser
};