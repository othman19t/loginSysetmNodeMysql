const jwt = require("jsonwebtoken");
const config = require("config");
const date = require("./date");

const tokens =  async (id) =>{
return {
    userId: id,
    accessToken: await jwt.sign({ id },config.get("accessTokenSecret")),
    refreshToken: await jwt.sign({ id },config.get("refreshTokenSecret")),
    accessTokenExpiry: parseInt(date.nowMillis()) + 1200000, //1200000  20 mins from now
    refreshTokenExpiry: parseInt(date.nowMillis()) + 864000000, // 10 days from now
    createdAt: date.nowDate(),
    lastModifiedAt: date.nowDate(),
  }
}

  module.exports = tokens;