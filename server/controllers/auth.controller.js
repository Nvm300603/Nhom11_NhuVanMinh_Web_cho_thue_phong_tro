const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/jwt.config");
const userModel = require("../models/user.model");

class authController {
	async register(req, res) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phoneRegex =
			/^(0|\+?84)(86|96|97|98|32|33|34|35|36|37|38|39|91|94|83|84|85|81|82|90|93|70|79|77|76|78|92|56|58|99|59|55|87)\d{7}$/;

		try {
			const { phone_number, password, email, name } = req.body;
			const role = "user";

			if (!name) {
				return res
					.status(400)
					.json({ message: "Tên không được để trống" });
			}

			if (!phoneRegex.test(phone_number)) {
				return res
					.status(400)
					.json({ message: "Số điện thoại không hợp lệ" });
			}

			if (!emailRegex.test(email)) {
				return res.status(400).json({ message: "Email không hợp lệ" });
			}

			const phoneExist = await userModel.getUserByPhoneNumber(
				phone_number
			);
			if (phoneExist) {
				return res
					.status(400)
					.json({
						message: "Số điện thoại đã tồn tại trong hệ thống",
					});
			}

			const emailExist = await userModel.getUserByEmail(email);
			if (emailExist) {
				return res
					.status(400)
					.json({ message: "Email đã tồn tại trong hệ thống" });
			}

			const addedUser = await userModel.createUser({
				phone_number,
				password,
				email,
				name,
				role,
			});

			res.status(201).json({
				data: addedUser,
				message: "Đăng ký tài khoản thành công",
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "Đã có lỗi xảy ra" });
		}
	}

	async login(req, res) {
		try {
			const { phone_number, password } = req.body;

			const user = await userModel.getUserByPhoneNumber(phone_number);
			if (!user || !(await bcrypt.compare(password, user.password))) {
				return res
					.status(401)
					.json({ message: "Thông tin đăng nhập không hợp lệ." });
			}

			const token = jwt.sign(
				{
					id: user.id,
					email: user.email,
					phone_number: user.phone_number,
					name: user.name,
					role: user.role,
				},
				secretKey,
				{
					expiresIn: "1d",
				}
			);

			res.status(200).json({
				data: { token },
				message: "Đăng nhập thành công.",
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Đã có lỗi xảy ra" });
		}
	}

	async info(req, res) {
		try {
			const user_id = req.user.id;
			const user = await userModel.getUserById(user_id);

			if (!user) {
				return res
					.status(401)
					.json({ message: "Thông tin token không hợp lệ." });
			}

			const { password, ...userWithoutPassword } = user;

			res.status(200).json({
				data: { user: userWithoutPassword },
				message: "Lấy thông tin token thành công.",
			});
		} catch (error) {
			res.status(500).json({ message: "Đã có lỗi xảy ra" });
		}
		
	}
}

module.exports = new authController();
