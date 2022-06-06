// Initialize Cloud Firestore through Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyD9VHp0c3Lo3WOpKUFlJt7xarguQ5kdMEI",
  authDomain: "designres-7dc24.firebaseapp.com",
  projectId: "designres-7dc24",
  storageBucket: "designres-7dc24.appspot.com",
  messagingSenderId: "184782531938",
  appId: "1:184782531938:web:161f8e69cb40e9b2af903b",
  measurementId: "G-KY47X7P7LZ",
});

const db = getFirestore(firebaseApp);

export { db };