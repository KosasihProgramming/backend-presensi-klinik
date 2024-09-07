const mysql = require("mysql");

const dbConfig = {
  host: "localhost",
  // user: "klinikko_adminsik",
  // password: "4Wd4b!k4tt!",
  // database: "klinikko_sik",
  user: "root",
  password: "",
  database: "sik2",
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

module.exports = connection;
