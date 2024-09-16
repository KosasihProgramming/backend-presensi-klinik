// Fungsi untuk mengecek jabatan
const cekJabatan = (obj) => {
  // Mengecek apakah properti jbtn ada dan mengandung kata "dokter"
  if (obj.hasOwnProperty("jbtn") && obj.jbtn.includes("dokter")) {
    return true;
  } else {
    return false;
  }
};

// Fungsi untuk menghitung denda keterlambatan
const DendaPulangCepat = (data, telatMenit) => {
  const jabatan = cekJabatan(data); // Tidak perlu await, cekJabatan tidak async
  let denda = 0;

  // Jika jabatan adalah dokter
  if (jabatan) {
    // Logika denda untuk dokter yang tidak pindah klinik
    if (telatMenit <= 0) {
      denda = 0;
    } else if (telatMenit > 0 && telatMenit <= 4) {
      denda = 2500;
    } else if (telatMenit > 4 && telatMenit <= 9) {
      denda = 5000;
    } else if (telatMenit > 9 && telatMenit <= 19) {
      denda = 10000;
    } else if (telatMenit > 19 && telatMenit <= 29) {
      denda = 20000;
    } else if (telatMenit > 29) {
      denda = (telatMenit - 29) * 1000 + 20000;
    }
  } else {
    // Logika denda untuk non-dokter
    if (telatMenit <= 0) {
      denda = 0;
    } else if (telatMenit > 0 && telatMenit <= 4) {
      denda = 2500;
    } else if (telatMenit > 4 && telatMenit <= 14) {
      denda = 10000;
    } else if (telatMenit > 14 && telatMenit <= 29) {
      denda = 15000;
    } else if (telatMenit > 29) {
      denda = 25000;
    }
  }

  return denda;
};

module.exports = {
  DendaPulangCepat,
};
