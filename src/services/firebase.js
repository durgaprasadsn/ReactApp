// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    // Your Firebase config object here
    apiKey: "AIzaSyDaSjFZdq-spAvP0hvu9JGoxqcEpiChy6c",
    authDomain: "dpsn-89d2e.firebaseapp.com",
    projectId: "dpsn-89d2e",
    storageBucket: "dpsn-89d2e.appspot.com",
    messagingSenderId: "259785568756",
    appId: "1:259785568756:web:3467093745de5e8b6dc9a1",
    measurementId: "G-XTVEW7XJGK",
    databaseURL: "https://dpsn-89d2e-default-rtdb.asia-southeast1.firebasedatabase.app/"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
