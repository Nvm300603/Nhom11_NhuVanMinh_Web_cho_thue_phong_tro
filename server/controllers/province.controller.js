const provinceModel = require("../models/province.model");
const districtModel = require("../models/district.model");

class provinceController {
	async getProvinces(req, res) {
		try {
			const provinces = await provinceModel.getProvinces();

			res.status(200).json({
				data: provinces,
				message: "Lấy danh sách tỉnh/thành phố thành công.",
			});
		} catch (error) {
			res.status(500).json({ message: "Đã có lỗi xảy ra" });
		}
	}

    async getDistrictsByProvinceCode(req, res) {
        try {
            const province_code = req.params.province_code;
			const districts = await districtModel.getDistrictsByProvinceCode(province_code);

			res.status(200).json({
				data: districts,
				message: "Lấy danh sách quận/huyện thành công.",
			});
		} catch (error) {
			res.status(500).json({ message: "Đã có lỗi xảy ra" });
		}
    }
}

module.exports = new provinceController();
