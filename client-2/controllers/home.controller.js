class homeController {
    async index(req, res)
    {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        
        const url = `http://localhost:3000/api/rooms?page=${page}&limit=${limit}`;
        try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.status === 200) {
				const result = await response.json();
				if (result && result.data) {
					res.render('home/index', { rooms: result.data, pagination: result.pagination });
				}
                
			} else {
                res.render('home/index')
			}
		} catch (error) {
			console.error(error);
            res.render('home/index')
		}
        res.render('home/index')
    }
}
module.exports = new homeController();
