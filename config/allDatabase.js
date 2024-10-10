const mysql = require("mysql");

// Fungsi untuk membuat pool connection
const createDbPool = (dbConfig) => {
  return mysql.createPool({
    connectionLimit: 10, // Batas maksimum koneksi
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
  });
};

// Konfigurasi database
const dbKemiling = {
  host: "202.157.189.177",
  port: "3306",
  user: "aris",
  password: "Kosasih20!8",
  database: "acc_kemiling",
};

const dbGtsKemiling = {
  host: "202.157.189.177",
  port: "3306",
  user: "aris",
  password: "Kosasih20!8",
  database: "aco_gtskemiling",
};

const dbGtsTirtayasa = {
  host: "202.157.189.177",
  port: "3306",
  user: "aris",
  password: "Kosasih20!8",
  database: "aco_gtstirtayasa",
};

const dbGading = {
  host: "202.157.189.177",
  port: "3306",
  user: "aris",
  password: "Kosasih20!8",
  database: "acc_gading",
};

const dbRajabasa = {
  host: "202.157.189.177",
  port: "3306",
  user: "aris",
  password: "Kosasih20!8",
  database: "acc_rajabasa",
};

const dbUrip = {
  host: "202.157.189.177",
  port: "3306",
  user: "aris",
  password: "Kosasih20!8",
  database: "acc_urip",
};

const dbTugu = {
  host: "202.157.189.177",
  port: "3306",
  user: "aris",
  password: "Kosasih20!8",
  database: "acc_tugu",
};

const dbTirtayasa = {
  host: "202.157.189.177",
  port: "3306",
  user: "aris",
  password: "Kosasih20!8",
  database: "acc_tirtayasa",
};

const dbPanjang = {
  host: "202.157.189.177",
  port: "3306",
  user: "aris",
  password: "Kosasih20!8",
  database: "acc_panjang",
};

const dbTeluk = {
  host: "202.157.189.177",
  port: "3306",
  user: "aris",
  password: "Kosasih20!8",
  database: "acc_teluk",
};

const dbBugis = {
  host: "202.157.189.177",
  port: "3306",
  user: "aris",
  password: "Kosasih20!8",
  database: "acc_bugis",
};

const dbPalapa = {
  host: "202.157.189.177",
  port: "3306",
  user: "aris",
  password: "Kosasih20!8",
  database: "acc_palapa",
};

// Membuat pool untuk setiap database
const poolKemiling = createDbPool(dbKemiling);
const poolGtsKemiling = createDbPool(dbGtsKemiling);
const poolGtsTirtayasa = createDbPool(dbGtsTirtayasa);
const poolGading = createDbPool(dbGading);
const poolRajabasa = createDbPool(dbRajabasa);
const poolUrip = createDbPool(dbUrip);
const poolTugu = createDbPool(dbTugu);
const poolTirtayasa = createDbPool(dbTirtayasa);
const poolPanjang = createDbPool(dbPanjang);
const poolTeluk = createDbPool(dbTeluk);
const poolBugis = createDbPool(dbBugis);
const poolPalapa = createDbPool(dbPalapa);

// Ekspor pool koneksi
module.exports = {
  poolKemiling,
  poolGtsKemiling,
  poolGtsTirtayasa,
  poolGading,
  poolRajabasa,
  poolUrip,
  poolTugu,
  poolTirtayasa,
  poolPanjang,
  poolTeluk,
  poolBugis,
  poolPalapa,
};
