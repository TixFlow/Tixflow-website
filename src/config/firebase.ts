// firebase.ts
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAx2Pauwl6ZufjFPzqz3WfHZGu1B98U3dE",
  authDomain: "tixflow-cb2a0.firebaseapp.com",
  projectId: "tixflow-cb2a0",
  storageBucket: "tixflow-cb2a0.appspot.com",
  messagingSenderId: "683703747505",
  appId: "1:683703747505:web:d43b4e6e021c915eb7f390",
  measurementId: "G-QD6FVHWPNC",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
