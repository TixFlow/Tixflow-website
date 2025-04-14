import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCK5bffhPGjYWp_ZnkxSzv8wBrqWqMR-5U",
  authDomain: "ticketresell-f12aa.firebaseapp.com",
  projectId: "ticketresell-f12aa",
  storageBucket: "ticketresell-f12aa.firebasestorage.app",
  messagingSenderId: "754722843583",
  appId: "1:754722843583:web:9b8f838532dec12a770f0a",
  measurementId: "G-5VWRVXP1E1",
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
