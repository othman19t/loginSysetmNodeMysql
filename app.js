const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const userRoute = require("./src/routes/userRoutes");

app.use(cors()); // TODO: production => should have regin set to our domain only
app.use(bodyParser.json()); // allow you access req

app.use(userRoute);

 module.exports = app;