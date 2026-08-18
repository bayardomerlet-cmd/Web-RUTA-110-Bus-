import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  limit,
  doc,
  setDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuración de tu proyecto Firebase "ruta110-managua"
const firebaseConfig = {
  apiKey: "AIzaSyDsJpCtpAcAPNkWC4FR73fjHw6VlwQ19Oo",
  authDomain: "ruta110-managua.firebaseapp.com",
  projectId: "ruta110-managua",
  storageBucket: "ruta110-managua.firebasestorage.app",
  messagingSenderId: "44830270588",
  appId: "1:44830270588:web:4252ae9f7a97c001fe95f9",
  measurementId: "G-L83W1WG3N0"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exponer de forma global para integrarlo con script.js
window.FirebaseApp = app;
window.FirebaseDB = db;
window.FirebaseSDK = {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  limit,
  doc,
  setDoc,
  deleteDoc
};

console.log("🔥 Firebase inicializado correctamente para Ruta 110 Managua");
window.dispatchEvent(new Event('firebaseReady'));

