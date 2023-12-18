import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhZRTwf2ZAEm6SBfYxdDAcCGX5cRF_6qU",
  authDomain: "diaragustiara.firebaseapp.com",
  databaseURL: "https://diaragustiara.firebaseio.com",
  projectId: "diaragustiara",
  storageBucket: "diaragustiara.appspot.com",
  messagingSenderId: "20005055689",
  appId: "1:20005055689:web:0b533b918d90cddefb7118",
  measurementId: "G-85HJLE36SW"
};
// Initialize Firebase

const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
export const storage = getStorage(app);
export const db = getFirestore(app);
