// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCbsTKlizaZ5krxoMQWvwy7Ljhqfk4RzZI",
  authDomain: "irwan-s.firebaseapp.com",
  projectId: "irwan-s",
  storageBucket: "irwan-s.firebasestorage.app",
  messagingSenderId: "306980146994",
  appId: "1:306980146994:web:19dc4144d0fec84c38512b",
  measurementId: "G-3T1LZW4KL2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
