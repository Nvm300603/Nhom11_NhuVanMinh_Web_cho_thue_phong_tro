const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const routes = require("./routes");

const { createPool } = require("./config/database");

const app = express();
app.use(cors());
const PORT = 3000;
app.use(express.static(path.join(__dirname, 'public')));


// Khi ứng dụng được khởi động, tạo connection pool
createPool()
	.then(() => {
		console.log("MySQL connection pool created");

		// Sử dụng bodyParser để parse JSON từ request body
		app.use(bodyParser.json());

		// Sử dụng routes
		app.use(routes);

		// Khởi động server
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error("Error creating MySQL connection pool:", error);
		process.exit(1); // Thoát ứng dụng nếu không thể tạo connection pool
	});
