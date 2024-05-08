class authController {
	async login_view(req, res) {
		res.render("auth/login");
	}
	async register_view(req, res) {
		res.render("auth/register");
	}
	async login(req, res) {
		const { phone_number, password } = req.body;
		try {
			const response = await fetch("http://localhost:3000/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					phone_number: phone_number,
					password: password,
				}),
			});

			const result = await response.json();

			if (response.status === 200) {
				if (result && result.data.token) {
					res.cookie("accessToken", result.data.token, {
						maxAge: 86400000, // 1 ngày
						httpOnly: true,
						secure: true,
					});
				}
				return res.json(result);
			} else {
				return res
					.status(response.status)
					.json({ message: result.message });
			}
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Internal Server Error" });
		}
	}

	async logout(req, res) {
		res.clearCookie("accessToken");
		res.redirect("/");
	}

	async register(req, res) {
		const { name, email, phone_number, password } = req.body;
		try {
			const response = await fetch("http://localhost:3000/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: name,
					email: email,
					phone_number: phone_number,
					password: password,
				}),
			});

			const result = await response.json();
			if (response.status === 200) {
				return res.json(result);
			} else {
				return res
					.status(response.status)
					.json({ message: result.message });
			}
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Internal Server Error" });
		}
	}
}

module.exports = new authController();
