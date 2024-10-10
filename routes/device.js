const express = require("express");
const connection = require("../config/database");

const router = express.Router();

router.post("/", function (req, res, next) {
  const { encode } = req.body;

  const stringQuery =
    "SELECT  * FROM device_system WHERE id = '" + encode + "'";

  connection.query(stringQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log(result);
    console.log(stringQuery);
    console.log("Jumlah data detail jadwal : ", result.length);
    res.json(result);
  });
});

router.post("/add", function (req, res, next) {
  const { nama, cabang, encoded } = req.body;

  // Cek apakah data sudah ada di database
  const checkExistingQuery = `
    SELECT * FROM device_system WHERE id = '${encoded}'
  `;

  connection.query(checkExistingQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      res.status(500).json({ error: "Database query error" });
      return;
    }

    if (result.length > 0) {
      // Jika data sudah ada
      console.log("Data sudah ada, tidak melakukan insert.");
      res.status(400).json({ message: "Data already exists" });
    } else {
      // Jika data belum ada, lakukan insert
      const addPegawaiQuery = `
        INSERT INTO device_system (
          id, device_name, cabang
        ) VALUES (
          '${encoded}', '${nama}', '${cabang}'
        )
      `;

      connection.query(addPegawaiQuery, (error, result) => {
        if (error) {
          console.log("Error executing query", error);
          res.status(500).json({ error: "Failed to insert data" });
          return;
        }
        console.log("Data berhasil diinsert");
        res.json({ message: "Data inserted successfully", result });
      });
    }
  });
});

module.exports = router;
