const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const cookieParser = require("cookie-parser");

const database = require("./config/database");
require("dotenv").config();

const routesApiVer1 = require("./api/v1/routes/index.route");

const app = express();
const port = process.env.PORT;

app.use(cors());

database.connect();

app.use(cookieParser()); //@@ ko dùng flash nên ko cần điền key bừa nữa

//@ parse application/json
app.use(bodyParser.json());

//@ Routes Version 1
routesApiVer1(app);

app.listen(port, () => {
    console.log(`Running port ${port} - By Diner`);
});
