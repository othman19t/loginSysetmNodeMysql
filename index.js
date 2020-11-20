const app = require("./app");
const config = require("config");


app.listen(config.get("port"), config.get("host"));
console.log(
  `info: host => ${config.get("host")} port => ${config.get("port")}`
);
