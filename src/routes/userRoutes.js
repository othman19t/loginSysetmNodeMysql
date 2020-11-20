const express = require("express");
const router = express.Router();

const singUp = require("../controllers/signup");
const login = require("../controllers/login");
router.post("/user/signup", singUp);
router.post("/user/login", login);
module.exports = router;
