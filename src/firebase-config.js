// Importa las funciones que necesitas de los SDKs que vas a usar
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// La configuración de tu aplicación web en Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC0zmttWcR15bv-YYnamwgCLaxkEu72qBY",
  authDomain: "aprendiendojuntitos-31caf.firebaseapp.com",
  projectId: "aprendiendojuntitos-31caf",
  storageBucket: "aprendiendojuntitos-31caf.appspot.com",
  messagingSenderId: "742832904460",
  appId: "1:742832904460:web:6aff1e7a279b0187a85129",
  measurementId: "G-16FK99RR6K" // Puedes omitirlo si no usas Analytics
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
// Inicializa Firestore
const db = getFirestore(app);

export { app, db };
