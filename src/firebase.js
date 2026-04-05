import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyATA2dm0KO1PDM9EQiTRGL7zYwOO1e43Rw",
  authDomain: "food-map-ed0b9.firebaseapp.com",
  projectId: "food-map-ed0b9",
  storageBucket: "food-map-ed0b9.appspot.com"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);