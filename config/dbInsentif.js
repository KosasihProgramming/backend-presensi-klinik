const mysql = require("mysql");

const dbConfig = {
  host: "202.157.189.177",
  port: "3306",
  user: "aris",
  password: "Kosasih20!8",
  database: "acc_rajabasa",
};

const poolInsentif = mysql.createConnection(dbConfig);

poolInsentif.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

module.exports = poolInsentif;
