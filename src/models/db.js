const mysql = require("mysql2/promise");
const config = require("config");
const pool = mysql.createPool({
  connectionLimit: 10,
  waitForConnections: true,
  host: config.get("dbHost"),
  user: config.get("user"),
  password: config.get("password"),
  database: config.get("database"),
});

module.exports = pool;
