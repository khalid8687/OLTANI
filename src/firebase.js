import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC9Aqio31eAA-ywONujcoci_QYenfS4cDc",
  authDomain: "ledatube-4f371.firebaseapp.com",
  projectId: "ledatube-4f371",
  storageBucket: "ledatube-4f371.firebasestorage.app",
  messagingSenderId: "375270423833",
  appId: "1:375270423833:web:2c697cea3ca42787351988",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;
