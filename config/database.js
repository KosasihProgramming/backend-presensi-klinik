const mysql = require("mysql");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "sik",
};

const connection = mysql.createConnection(dbConfig);

module.exports = connection;
