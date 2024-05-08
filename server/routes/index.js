const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const roomRoutes = require("./room.routes");
const provinceRoutes = require("./province.routes");
const districtRoutes = require("./district.routes");
const imageRoutes = require("./image.routes");

router.use("/api", [
	authRoutes,
	roomRoutes,
	provinceRoutes,
	districtRoutes,
	imageRoutes,
]);

module.exports = router;
