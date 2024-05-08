const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const homeRoutes = require("./home.routes");
const roomRoutes = require("./room.routes");
const adminRoutes = require("./admin.routes");

router.use("/", [
	authRoutes,
	homeRoutes,
	roomRoutes,
	adminRoutes,
]);

module.exports = router;
