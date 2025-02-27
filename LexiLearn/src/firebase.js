import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRARA4VT8q_GMCRgbd6Kg2mwoSIevJqaI",
  authDomain: "lexilearnsank.firebaseapp.com",
  databaseURL: "https://lexilearnsank-default-rtdb.firebaseio.com",
  projectId: "lexilearnsank",
  storageBucket: "lexilearnsank.firebasestorage.app",
  messagingSenderId: "1017959116930",
  appId: "1:1017959116930:web:3bd565767189a9c939049b",
  measurementId: "G-8FPHWS1RMJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export const database = getDatabase(app);
export const analytics = getAnalytics(app);

export { db, auth };