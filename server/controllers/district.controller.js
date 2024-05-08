
const wardModel = require("../models/ward.model");

class districtController {
    async getWardsByDistrictCode(req, res) {
        try {
            const district_code = req.params.district_code;
			const wards = await wardModel.getWardsByDistrictCode(district_code);

			res.status(200).json({
				data: wards,
				message: "Lấy danh sách phường/xã thành công.",
			});
		} catch (error) {
			res.status(500).json({ message: "Đã có lỗi xảy ra" });
		}
    }
}

module.exports = new districtController();
