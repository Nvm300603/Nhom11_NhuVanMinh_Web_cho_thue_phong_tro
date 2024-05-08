// const roomModel = require('../models/room.model');
// const { createSlugFromTitle } = require('../utils');

class roomController {
//     async getRooms(req, res) {
//         let page = parseInt(req.query.page) || 1;
//         let limit = parseInt(req.query.limit) || 10;

//         const rooms = await roomModel.getRoomsPerPage((page - 1) * limit, limit);

//         const totalRooms = await roomModel.getTotalRooms();
//         const totalPages = Math.ceil(totalRooms / limit);

//         res.status(200).json({
//             data: rooms,
//             pagination: {
//                 page: parseInt(page),
//                 limit: parseInt(limit),
//                 totalRooms,
//                 totalPages
//             }
//         });
//     }

//     async getRoom(req, res) {
//         const room = await roomService.getById(req.params.id);
//         res.json(room);
//     }

    async getRoomBySlug(req, res) {
        const slug = req.params.slug;
        try {
			const response = await fetch("http://localhost:3000/api/rooms/slug/"+slug+"", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				}
			});

			if (response.status === 200) {
				const result = await response.json();
				if (result && result.data) {
					res.render('room/detail', { room: result.data.room, google_map: result.data.google_map, relatedRooms: result.data.relatedRooms });
				}
			} else {
				res.redirect('/');
			}
		} catch (error) {
			res.redirect('/');
		}
    }

	async createMyRoom(req, res) {
        res.render('room/create-myroom')
    }
	async editMyRoom(req, res) {
		const token = req.cookies.accessToken;
		const roomId = req.params.id;
		try {
			const response = await fetch("http://localhost:3000/api/rooms/my_rooms/"+roomId+"", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				}
			});
			const result = await response.json();

			if (response.status === 200) {
				
				if (result && result.data) {
					res.render('room/edit-myroom', { room: result.data });
				}
			} else {
				res.redirect('/my_rooms');
			}
		} catch (error) {
			res.redirect('/my_rooms');
		}
    }

    async getMyRooms(req, res) {
        const token = req.cookies.accessToken;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        
        const url = `http://localhost:3000/api/rooms/my_rooms?page=${page}&limit=${limit}`;
        try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
				},
			});

			if (response.status === 200) {
				const result = await response.json();
				if (result && result.data) {
					res.render('room/myroom', { rooms: result.data, pagination: result.pagination });
				}
                
			} else {
                res.render('room/myroom')
			}
		} catch (error) {
			console.error(error);
            res.render('room/myroom')
		}
        res.render('room/myroom')
    }

	async createRoom(req, res) {
		const token = req.cookies.accessToken;
		const { title, address, description, image, price, area, province_code, district_code, ward_code } = req.body;
		const url = `http://localhost:3000/api/rooms`;
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({
					title: title,
					address: address,
					description: description,
					image: image,
					price: price,
					area: area,
					province_code: province_code,
					district_code: district_code,
					ward_code: ward_code
				}),
			});

			const result = await response.json();
			return res.json(result);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	}

	async updateRoom(req, res) {
		const token = req.cookies.accessToken;
		const roomId = req.params.id;
		const { title, address, description, image, price, area, province_code, district_code, ward_code } = req.body;
		const url = `http://localhost:3000/api/rooms/my_rooms/${roomId}`;
		try {
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({
					title: title,
					address: address,
					description: description,
					image: image,
					price: price,
					area: area,
					province_code: province_code,
					district_code: district_code,
					ward_code: ward_code
				}),
			});

			const result = await response.json();
			return res.json(result);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	}

    async deleteMyRoom(req, res) {
		const token = req.cookies.accessToken;
        const roomId = req.params.id;
		
        try {
            const url = `http://localhost:3000/api/rooms/my_rooms/${roomId}`;
			const response = await fetch(url, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
			});
            res.json({ message: 'Xóa phòng thành công' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa phòng' });
        }
    }
    
}

module.exports = new roomController();