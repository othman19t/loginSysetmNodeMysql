const validate = require("validator");
const db = require("../models/db");
/* ========================== login implementation  ======================*/
const login = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "user hit the router!!",
  });
};

module.exports = login;
