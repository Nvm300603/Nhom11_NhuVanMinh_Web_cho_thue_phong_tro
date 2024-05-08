const roomModel = require('../models/room.model');
const { createSlugFromTitle } = require('../utils');
const { google_map_key } = require("../config/google_map.config");

class RoomController {
    async getRooms(req, res) {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        const rooms = await roomModel.getRoomsPerPage((page - 1) * limit, limit);

        const totalRooms = await roomModel.getTotalRooms();
        const totalPages = Math.ceil(totalRooms / limit);

        res.status(200).json({
            data: rooms,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalRooms,
                totalPages
            }
        });
    }

    async getAdminRooms(req, res) {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let isAdmin = true;
        const rooms = await roomModel.getRoomsPerPage((page - 1) * limit, limit, isAdmin);

        const totalRooms = await roomModel.getTotalRooms(isAdmin);
        const totalPages = Math.ceil(totalRooms / limit);

        res.status(200).json({
            data: rooms,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalRooms,
                totalPages
            }
        });
    }

    async updateRoomPublishStatus(req, res)
    {
        const { is_published } = req.body;
        const roomId = req.params.id;
        try {
            const updatedRoom = await roomModel.updateRoomPublishStatus(roomId, is_published);

            res.status(200).json({
                data: updatedRoom,
                message: "Published thành công"
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Đã có lỗi xảy ra khi published" });
        }
    }

    async getMyRooms(req, res) {
        const user_id = req.user.id;
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        const rooms = await roomModel.getMyRoomsPerPage(user_id, (page - 1) * limit, limit);

        const totalRooms = await roomModel.getTotalMyRooms(user_id);
        const totalPages = Math.ceil(totalRooms / limit);

        res.status(200).json({
            data: rooms,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalRooms,
                totalPages
            }
        });
    }

    async getMyRoomById(req, res) {
        const user_id = req.user.id;
        const room = await roomModel.getRoomById(req.params.id);

        if(!room && !room.user_id != user_id)
        {
            return res.status(404).json({ message: "Không tìm thấy phòng" });
        }

        res.status(200).json({ data: room, message: "Lấy phòng thành công" });

    }

    

    async getRoom(req, res) {
        const room = await roomService.getById(req.params.id);
        res.json(room);
    }

    async getRoomBySlug(req, res) {
        try {
            const slug = req.params.slug;
            const room = await roomModel.getRoomBySlug(slug);
            const getRelatedRooms = await roomModel.getRoomsByDistrictCode(room.district_code, room.id, 10);
            
            if (!room) {
                return res.status(404).json({ message: "Không tìm thấy phòng" });
            }

            const google_map = `${google_map_key}`;
    
            res.status(200).json({ data: { room, google_map, relatedRooms: getRelatedRooms }, message: "Lấy danh sách phòng thành công" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Đã có lỗi xảy ra" });
        }
    }

    async createRoom(req, res) {
        const { title, address, description, image, price, area, province_code, district_code, ward_code } = req.body;
        
        if (!title) {
            return res.status(400).json({ message: "Vui lòng nhập tiêu đề" });
        }
    
        if (!address) {
            return res.status(400).json({ message: "Vui lòng nhập địa chỉ" });
        }
    
        if (!image) {
            return res.status(400).json({ message: "Vui lòng nhập đường dẫn ảnh" });
        }
    
        if (!price) {
            return res.status(400).json({ message: "Vui lòng nhập giá" });
        }
    
        if (!area) {
            return res.status(400).json({ message: "Vui lòng nhập diện tích" });
        }
    
        if (!province_code || !district_code || !ward_code) {
            return res.status(400).json({ message: "Vui lòng chọn địa chỉ chi tiết" });
        }

        let slug = createSlugFromTitle(title);

        const user_id = req.user.id;

        try {
            let slugExists = await roomModel.getRoomBySlug(slug);

            let counter = 1;
            while (slugExists) {
                slug = `${slug}-${counter}`;
                slugExists = await roomModel.getRoomBySlug(slug);
                counter++;
            }

            const newRoom = await roomModel.createRoom({
                title,
                slug,
                address,
                description,
                image,
                price,
                area,
                province_code,
                district_code,
                ward_code,
                user_id
            });

            res.status(201).json({
                data: newRoom,
                message: "Tạo phòng thành công"
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Đã có lỗi xảy ra khi tạo phòng" });
        }
    }
    
    async updateMyRoom(req, res) {
        const { title, address, description, image, price, area, province_code, district_code, ward_code } = req.body;
        
        if (!title) {
            return res.status(400).json({ message: "Vui lòng nhập tiêu đề" });
        }
    
        if (!address) {
            return res.status(400).json({ message: "Vui lòng nhập địa chỉ" });
        }
    
        if (!image) {
            return res.status(400).json({ message: "Vui lòng nhập đường dẫn ảnh" });
        }
    
        if (!price) {
            return res.status(400).json({ message: "Vui lòng nhập giá" });
        }
    
        if (!area) {
            return res.status(400).json({ message: "Vui lòng nhập diện tích" });
        }
    
        if (!province_code || !district_code || !ward_code) {
            return res.status(400).json({ message: "Vui lòng chọn địa chỉ chi tiết" });
        }

        const user_id = req.user.id;
        const roomId = req.params.id;
        const room = await roomModel.getRoomById(roomId);

        if(!room && !room.user_id != user_id)
        {
            return res.status(404).json({ message: "Không tìm thấy phòng" });
        }

        let slug = createSlugFromTitle(title);

        try {
            let slugExists = await roomModel.getRoomBySlug(slug);

            let counter = 1;
            while (slugExists && slugExists.id !== id) {
                slug = `${slug}-${counter}`;
                slugExists = await roomModel.getRoomBySlug(slug);
                counter++;
            }

            const updatedRoom = await roomModel.updateRoom(roomId, {
                title,
                slug,
                address,
                description,
                image,
                price,
                area,
                province_code,
                district_code,
                ward_code,
                user_id
            });

            res.status(200).json({
                data: updatedRoom,
                message: "Cập nhật phòng thành công"
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Đã có lỗi xảy ra khi cập nhật phòng" });
        }
    }
    
    async updateRoom(req, res) {
        const roomId = req.params.id;
        const { title, address, description, image, price, area, province_code, district_code, ward_code } = req.body;
    
        try {
            const existingRoom = await roomModel.getRoomById(roomId);
            if (!existingRoom) {
                return res.status(404).json({ message: "Phòng không tồn tại" });
            }
    
            const updatedRoom = await roomModel.updateRoom(roomId, {
                title,
                address,
                description,
                image,
                price,
                area,
                province_code,
                district_code,
                ward_code
            });
    
            res.status(200).json({
                data: updatedRoom,
                message: "Cập nhật thông tin phòng thành công"
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Đã có lỗi xảy ra khi cập nhật phòng" });
        }
    }

    async deleteRoom(req, res) {
        const roomId = req.params.id;
        try {
            const existingRoom = await roomModel.getRoomById(roomId);
            if (!existingRoom) {
                return res.status(404).json({ message: "Phòng không tồn tại" });
            }
            await roomModel.deleteRoom(roomId);
            res.json({ message: 'Xóa phòng thành công' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa phòng' });
        }
    }

    async deleteMyRoom(req, res) {
        const user_id = req.user.id;
        const roomId = req.params.id;
        try {
            const existingRoom = await roomModel.getRoomById(roomId);
            if (!existingRoom && existingRoom.user_id != user_id) {
                return res.status(404).json({ message: "Phòng không tồn tại" });
            }
            await roomModel.deleteRoom(roomId);
            res.json({ message: 'Xóa phòng thành công' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa phòng' });
        }
    }
    
}

module.exports = new RoomController();