// utils.js
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { storage } = require("../config/firebase");
const path = require("path");
const fs = require("fs");

const uploadImageToFirebase = async (buffer, name) => {
  try {
    // Tentukan nama file yang disimpan di Firebase
    const fileName = `mediaPresensi/${name}`;
    const storageRef = ref(storage, fileName);

    // Unggah buffer langsung ke Firebase Storage
    const snapshot = await uploadBytes(storageRef, buffer);

    // Ambil URL unduhan dari Firebase
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("Foto berhasil diunggah:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Gagal mengunggah foto:", error);
    throw error;
  }
};

module.exports = { uploadImageToFirebase };
