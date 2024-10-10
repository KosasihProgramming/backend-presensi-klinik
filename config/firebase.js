// firebaseConfig.js
const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyDtAtsx8WT1gcW1yRyuOE1zd8u4a88dHJg",
  authDomain: "chatwaotomatis-41388.firebaseapp.com",
  projectId: "chatwaotomatis-41388",
  storageBucket: "chatwaotomatis-41388.appspot.com",
  messagingSenderId: "452953293862",
  appId: "1:452953293862:web:fad232e3614ee65a7ed2e7",
  measurementId: "G-WK0VBSW2NS",
};

// Inisialisasi Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

module.exports = { storage };
