import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBzRA44ceQ594wxqT-6zrQuuCXhY7oMqzI",
  authDomain: "nus-battleprep.firebaseapp.com",
  projectId: "nus-battleprep",
  storageBucket: "nus-battleprep.firebasestorage.app",
  messagingSenderId: "887481925547",
  appId: "1:887481925547:web:1df2501915366232965cee",

  databaseURL:
    "https://nus-battleprep-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const realtimeDb = getDatabase(app);