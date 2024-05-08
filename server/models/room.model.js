const database = require('../config/database');
const mysql = require('mysql2/promise');


async function getRooms() {
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
        const [rows, fields] = await connection.query('SELECT * FROM rooms');
        return rows;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

async function getRoomsPerPage(offset, limit, isAdmin = false) {
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
        let query;
        if (isAdmin) {
            query = `SELECT * FROM rooms
                     ORDER BY created_at DESC
                     LIMIT ?, ?`;
        } else {
            query = `SELECT * FROM rooms WHERE is_published = 1
                     ORDER BY created_at DESC
                     LIMIT ?, ?`;
        }
        
        const [rows] = await connection.query(query, [offset, limit]);
        return rows;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

async function getMyRoomsPerPage(userId, offset, limit) {
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
        const query = `
            SELECT 
                r.*,
                CONCAT(r.address, ', ', w.name, ', ', d.name, ', ', p.name) AS full_address,
                p.name AS province_name,
                d.name AS district_name,
                w.name AS ward_name,
                u.phone_number AS user_phone_number,
                u.name AS user_name
            FROM 
                rooms r
            LEFT JOIN 
                wards w ON r.ward_code = w.code
            LEFT JOIN 
                districts d ON r.district_code = d.code
            LEFT JOIN 
                provinces p ON r.province_code = p.code
            LEFT JOIN 
                users u ON r.user_id = u.id
            WHERE 
                r.user_id = ?
            ORDER BY 
                r.created_at DESC
            LIMIT ?, ?`;
        const [rows] = await connection.query(query, [userId, offset, limit]);
        return rows;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}


async function getTotalRooms(isAdmin = false) {
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
        let query;
        if (isAdmin) {
            query = `SELECT COUNT(*) AS totalRooms FROM rooms`;
        } else {
            query = `SELECT COUNT(*) AS totalRooms FROM rooms WHERE is_published = 1`;
        }
        const [rows] = await connection.query(query);
        return rows[0].totalRooms;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}


async function getTotalMyRooms(userId) {
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
        const query = `SELECT COUNT(*) AS totalRooms FROM rooms
                       WHERE user_id = ?`;
        const [rows] = await connection.query(query, [userId]);
        return rows[0].totalRooms;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}


async function getRoomById(roomId) {
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
        const [rows, fields] = await connection.query('SELECT * FROM rooms WHERE id = ?', [roomId]);
        return rows[0];
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

async function getRoomBySlug(slug) {
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
        const [rows, fields] = await connection.query(`
            SELECT r.*,
                CONCAT(r.address, ', ', w.name, ', ', d.name, ', ', p.name) AS full_address,
                p.name AS province_name, d.name AS district_name, w.name AS ward_name,
                u.phone_number AS user_phone_number, u.name AS user_name
            FROM rooms AS r
            LEFT JOIN provinces AS p ON r.province_code = p.code
            LEFT JOIN districts AS d ON r.district_code = d.code
            LEFT JOIN wards AS w ON r.ward_code = w.code
            LEFT JOIN users AS u ON r.user_id = u.id
            WHERE r.slug = ? AND r.is_published = 1
        `, [slug]);
        return rows[0];
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

async function getRoomsByDistrictCode(districtCode, roomId, limit) {
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
        const [rows, fields] = await connection.query('SELECT * FROM rooms WHERE district_code = ? AND id != ? ORDER BY RAND() LIMIT ?', [districtCode, roomId, limit]);
        return rows;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

async function createRoom(roomData) {
    console.log(roomData);
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
        const { title, slug, address, description, image, price, area, province_code, district_code, ward_code, user_id } = roomData;
        // const escapedDescription = mysql.escape(description);
        // await connection.query('INSERT INTO rooms (title, slug, address, description, image, price, area, province_code, district_code, ward_code, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [title, slug, address, escapedDescription, image, price, area, province_code, district_code, ward_code, user_id]);
        await connection.query('INSERT INTO rooms (title, slug, address, description, image, price, area, province_code, district_code, ward_code, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [title, slug, address, description, image, price, area, province_code, district_code, ward_code, user_id]);
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

async function updateRoom(roomId, roomData) {
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
        const { title, address, description, image, price, area, province_code, district_code, ward_code } = roomData
        console.log(title);
        console.log(description);
        
        await connection.query('UPDATE rooms SET title = ?, address = ?, description = ?, image = ?, price = ?, area = ?, province_code = ?, district_code = ?, ward_code = ?, is_published = 0 WHERE id = ?', [title, address, description, image, price, area, province_code, district_code, ward_code, roomId]);
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

async function updateRoomPublishStatus(roomId, isPublished) {
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
        await connection.query('UPDATE rooms SET is_published = ? WHERE id = ?', [isPublished, roomId]);
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

async function deleteRoom(roomId) {
    const pool = database.getPool();
    const connection = await pool.getConnection();
    try {
        await connection.query('DELETE FROM rooms WHERE id = ?', [roomId]);
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}



module.exports = {
    getRooms,
    updateRoomPublishStatus,
    getRoomsPerPage,
    getMyRoomsPerPage,
    getTotalRooms,
    getTotalMyRooms,
    getRoomById,
    getRoomBySlug,
    getRoomsByDistrictCode,
    createRoom,
    updateRoom,
    deleteRoom
};