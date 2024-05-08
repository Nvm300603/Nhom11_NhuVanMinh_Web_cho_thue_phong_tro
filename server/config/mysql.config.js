require('dotenv').config();

const mysqlConfig = {
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE_NAME
};
  
module.exports = mysqlConfig;
  