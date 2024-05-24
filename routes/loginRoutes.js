const express = require("express");
const connection = require("../config/database");

const router = express.Router();

router.post("/check", (req, res) => {
  const { usere, passworde } = req.body;

  const query = "SELECT * FROM admin WHERE usere = ? AND passworde = ?";
  connection.query(query, [usere, passworde], (err, results) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      const user = results[0]; // Mengambil data pengguna dari hasil query
      res.json({ status: "success", message: "Login successful", user: user });
    } else {
      res.status(401).json({ status: "error", message: "Invalid credentials" });
    }
  });
});

module.exports = router;
