import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";

import { 
  getFirestore,

} from "firebase/firestore";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBSSvDGMByP-YEvY1MWqOOby_xQRlalYcc",
  authDomain: "myproject-e4bab.firebaseapp.com",
  projectId: "myproject-e4bab",
  storageBucket: "myproject-e4bab.appspot.com",
  messagingSenderId: "902895838078",
  appId: "1:902895838078:web:94c3c701127a7b5bc9492f",
  measurementId: "G-7P1TWLM6Y3"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// Export des fonctionnalités
export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail,
 
};