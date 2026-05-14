// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzRA44ceQ594wxqT-6zrQuuCXhY7oMqzI",
  authDomain: "nus-battleprep.firebaseapp.com",
  projectId: "nus-battleprep",
  storageBucket: "nus-battleprep.firebasestorage.app",
  messagingSenderId: "887481925547",
  appId: "1:887481925547:web:1df2501915366232965cee",
  measurementId: "G-GCGT0S0LBH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);