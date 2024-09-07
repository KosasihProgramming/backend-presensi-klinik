const express = require("express");
const connection = require("../config/database");

const router = express.Router();

// Ambil semua data
router.get("/data/", function (req, res, next) {
  const stringQuery = "SELECT * FROM pegawai";

  connection.query(stringQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("OK");
    res.json(result);
  });
});
router.post("/add-pegawai/", function (req, res, next) {
  const { id, nama, jk, barcode } = req.body;

  const addPegawaiQuery = `
    INSERT INTO pegawai (
      id, nik, nama, jk, jbtn, jnj_jabatan, kode_kelompok, kode_resiko, kode_emergency, departemen, bidang, stts_wp, stts_kerja, npwp, pendidikan, gapok, tmp_lahir, tgl_lahir, alamat, kota, mulai_kerja, ms_kerja, indexins, bpd, rekening, stts_aktif, wajibmasuk, pengurang, indek, mulai_kontrak, cuti_diambil, dankes, photo, no_ktp
    ) VALUES (
      '${id}', '1${barcode}', '${nama}', '${jk}', 'karkantor', '-', '-', '-', '-', 'RJ', '-', '-', 'FT', '-', 'S1 KEDOKTERAN', 0, '-', '2000-01-01', '-', '-', '2020-01-01', 'PT', '-', 'MANDIRI', 'rekening', '', 0, 0, 0, '0000-00-00', 0, 0, 'pages/pegawai/photo/', 'n0ktp'
    )
  `;

  const addBarcodeQuery = `
    INSERT INTO barcode (
      id, barcode
    ) VALUES (
      '${id}', '${barcode}'
    )
  `;

  // Mulai transaksi
  connection.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: "Transaction error: " + err });
    }

    // Eksekusi query untuk menambahkan data pegawai
    connection.query(addPegawaiQuery, (error, result) => {
      if (error) {
        return connection.rollback(() => {
          console.log("Error executing query", error);
          res.status(500).json({ error: "Database query error: " + error });
        });
      }

      // Eksekusi query untuk menambahkan data barcode
      connection.query(addBarcodeQuery, (error, result) => {
        if (error) {
          return connection.rollback(() => {
            console.log("Error executing query", error);
            res.status(500).json({ error: "Database query error: " + error });
          });
        }

        // Jika semua berhasil, commit transaksi
        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              console.log("Transaction commit error", err);
              res
                .status(500)
                .json({ error: "Transaction commit error: " + err });
            });
          }

          console.log("Transaction completed successfully");
          res.json({
            message: "Data pegawai dan barcode berhasil ditambahkan",
          });
        });
      });
    });
  });
});

// hapus data Pegawwai
router.delete("/delete-pegawai/:id", function (req, res, next) {
  const { id } = req.params;

  const deleteQuery = "DELETE FROM pegawai WHERE id = " + id;

  connection.query(deleteQuery, [id], (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("Data deleted successfully");
    res.json({ message: "Data deleted successfully" });
  });
});

// Update data pegawai
router.post("/update-pegawai/", function (req, res, next) {
  const { barcode, nama, jk } = req.body; // Hanya mengambil variabel yang diperlukan dari req.body
  const updateQuery =
    "UPDATE pegawai SET nama='" +
    nama +
    "', jk='" +
    jk +
    "' WHERE id=" +
    barcode;

  connection.query(updateQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return res.status(500).json({ error: "Database query error" });
    }
    console.log("OK");
    res.json(result);
  });
});

// ambil data berdasarkan id
router.post("/add/", function (req, res, next) {
  const { tanggalAwal, tanggalAkhir, bulan, tahun, barcode } = req.body;

  const addQuery =
    "insert into jadwal_kehadiran (tanggal_awal, tanggal_akhir, bulan,tahun, jumlahKehadiran,jumlah_shift, barcode, createdAt) values ('" +
    tanggalAwal +
    "','" +
    tanggalAkhir +
    "','" +
    bulan +
    "','" +
    tahun +
    "','0','0','" +
    barcode +
    "',CURDATE())";

  connection.query(addQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("OK");
    res.json(result);
  });
});

// Insett data
router.post("/", function (req, res, next) {
  const { nama_shift, jam_masuk, jam_pulang, nominal } = req.body;

  const insertQuery = `INSERT INTO shift (nama_shift, jam_masuk, jam_pulang, nominal) 
    VALUES (?, ?, ?, ?)`;

  connection.query(
    insertQuery,
    [nama_shift, jam_masuk, jam_pulang, nominal],
    (error, result) => {
      if (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      console.log("New record created");
      res.status(201).json({ message: "Data berhasil ditambahkan" });
    }
  );
});

// Update data
router.patch("/:id_shift", function (req, res, next) {
  const { id_shift } = req.params;
  const { nama_shift, jam_masuk, jam_pulang, nominal } = req.body;

  const updateQuery =
    "UPDATE shift SET nama_shift='" +
    nama_shift +
    "', jam_masuk='" +
    jam_masuk +
    "', jam_pulang='" +
    jam_pulang +
    "', nominal='" +
    nominal +
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
