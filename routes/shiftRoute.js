const express = require("express");
const connection = require("../config/database");

const router = express.Router();

// Ambil semua data
router.get("/", function (req, res, next) {
  const stringQuery = "SELECT * FROM shift";

  connection.query(stringQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("Query result:", result);
    res.json(result);
  });
});

// ambil data berdasarkan id
router.get("/:id_shift", function (req, res, next) {
  const { id_shift } = req.params;

  const showQuery = `SELECT * FROM shift WHERE id_shift = ` + id_shift;

  connection.query(showQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("Query result:", result);
    res.json(result);
  });
});

// Insett data
router.post("/", function (req, res, next) {
  const { nama_shift, jam_masuk, jam_pulang, nominal, garansi_fee } = req.body;

  const insertQuery =
    "INSERT INTO shift (nama_shift, jam_masuk, jam_pulang, nominal, garansi_fee, createdAt, updatedAt) VALUES ('" +
    nama_shift +
    "', '" +
    jam_masuk +
    "', '" +
    jam_pulang +
    "', '" +
    nominal +
    "', '" +
    garansi_fee +
    "', NOW(), NOW())";

  connection.query(insertQuery, (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    console.log("New record created:", result);
    res.status(201).json({ message: "Data berhasil ditambahkan" });
  });
});

// Update data
router.patch("/:id_shift", function (req, res, next) {
  const { id_shift } = req.params;
  const { nama_shift, jam_masuk, jam_pulang, nominal, garansi_fee } = req.body;

  const updateQuery =
    "UPDATE shift SET nama_shift='" +
    nama_shift +
    "', jam_masuk='" +
    jam_masuk +
    "', jam_pulang='" +
    jam_pulang +
    "', nominal='" +
    nominal +
    "', garansi_fee='" +
    garansi_fee +
    "' WHERE id_shift=" +
    id_shift;

  connection.query(
    updateQuery,
    [nama_shift, jam_masuk, jam_pulang, nominal],
    (error, result) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      console.log("Data updated successfully");
      res.json({ message: "Data updated successfully" });
    }
  );
});

// hapus data
router.delete("/:id_shift", function (req, res, next) {
  const { id_shift } = req.params;

  const deleteQuery = "DELETE FROM shift WHERE id_shift = " + id_shift;

  connection.query(deleteQuery, [id_shift], (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("Data deleted successfully");
    res.json({ message: "Data deleted successfully" });
  });
});

module.exports = router;
