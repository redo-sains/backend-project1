const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseApp = initializeApp({
  apiKey: "AIzaSyAaZX1ViArNl4mYQDK8a6ZR9KrdEvk22i0",
  authDomain: "birth-app-9723e.firebaseapp.com",
  projectId: "birth-app-9723e",
  storageBucket: "birth-app-9723e.appspot.com",
  messagingSenderId: "996204383668",
  appId: "1:996204383668:web:d69883e36f06241ecab6e1",
});

const db = getFirestore(firebaseApp);

module.exports = {
  db,
};
