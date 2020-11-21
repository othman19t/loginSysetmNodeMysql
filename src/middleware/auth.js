const jwt = require("jsonwebtoken");
const config = require("config");
const date = require("../functions/date");
const db = require("../models/db");
const auth = async (req, res, next) =>{
    const accessToken = req.header("x-access-token");
    const accessTokenExpiry = req.header("x-access-token-expiry");
    const tokenExpired = parseInt(accessTokenExpiry) < parseInt(date.nowMillis()); //return true if expired
    
    // check if token and expiry date is sent
    if(!accessToken || !accessTokenExpiry){
        return res.status(401).json({success: false,message: "Access token and expiry date are required."});
    } 
    // check if token has expired
    if(tokenExpired){
        return res.status(401).json({success: false,message: "Access token has expired."});
    }

    // check if token exist in db
    try {
        const decoded = jwt.verify(accessToken, config.get("accessTokenSecret"));
        const sql = "SELECT id FROM tokens WHERE accessToken = ? And accessTokenExpiry = ? LIMIT 1";
        const result = await db.query(sql, [accessToken, accessTokenExpiry]);
    if (result[0].length > 0) {
        req.user = decoded;
        next();
    }else{
        return res.status(401).json({success: false,message: "Unknown sAccess token and expiry date"});
    }
    } catch (err) {
        return res.status(500).json({success: false,message:"internal server error occurred"});
    }
}

module.exports = auth;