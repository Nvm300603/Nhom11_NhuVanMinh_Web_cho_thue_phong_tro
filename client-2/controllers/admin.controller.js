class adminController {
    async getAllRooms(req, res)
    {
        const token = req.cookies.accessToken;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        
        const url = `http://localhost:3000/api/admin/rooms?page=${page}&limit=${limit}`;
        try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
				},
			});
			console.log(response.status);

			if (response.status === 200) {
				const result = await response.json();
				if (result && result.data) {
					res.render('admin/rooms', { rooms: result.data, pagination: result.pagination });
				}
                
			} else {
                res.render('admin/rooms')
			}
		} catch (error) {
			console.error(error);
            res.render('admin/rooms')
		}
        res.render('admin/rooms')
    }

	async updateRoomPublishStatus(req, res) {
		const token = req.cookies.accessToken;
        const roomId = req.params.id;
		const { is_published } = req.body;
		
        try {
            const url = `http://localhost:3000/api/admin/rooms/${roomId}/publish`;
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({
					is_published: is_published
				}),
			});
            res.json({ message: 'Published thành công' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi published' });
        }
    }
}
module.exports = new adminController();