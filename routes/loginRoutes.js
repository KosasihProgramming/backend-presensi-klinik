const express = require("express");
const connection = require("../config/database");

const router = express.Router();

router.post("/check", (req, res) => {
  const { username, password } = req.body;
  const stringQuery =
    "SELECT * FROM admin WHERE usere ='" +
    username +
    "' AND passworde ='" +
    password +
    "'";

  connection.query(stringQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log(stringQuery);
    console.log("Jumalh user : ", result.length);

    if (result.length > 0) {
      const user = result[0]; // Mengambil data pengguna dari hasil query
      res.json({ status: "success", message: "Login successful", user: user });
    } else {
      res.status(401).json({ status: "error", message: "Invalid credentials" });
    }
  });
});

module.exports = router;
