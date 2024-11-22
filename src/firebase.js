import { getFirestore } from 'firebase/firestore';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBZ2MQvpjDIvj0LeM-c4R9rZTuioqTKnjY",
  authDomain: "maps-d788d.firebaseapp.com",
  projectId: "maps-d788d",
  storageBucket: "maps-d788d.firebasestorage.app",
  messagingSenderId: "215765401527",
  appId: "1:215765401527:web:1d0ecc77d4d053eab5f232",
  measurementId: "G-Z99RJZD6NN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
