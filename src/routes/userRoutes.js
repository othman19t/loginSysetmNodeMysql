const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth")
const singUp = require("../controllers/signup");
const login = require("../controllers/login");
router.post("/user/signup", singUp);
router.post("/user/login", login);


/**===================== from here everything should go through auth first================= **/
router.get("/user/me", auth, async(req, res) =>{
    return res.status(200).json({success: true, message: "it Worked!!"});
});
module.exports = router;
