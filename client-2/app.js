const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
const cookieParser = require('cookie-parser');


const app = express();
const PORT = 3002;

app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
    res.locals.loggedIn = req.cookies.accessToken ? true : false;
    next();
});

// Thiết lập view engine là EJS
app.set('view engine', 'ejs');

app.use(routes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
