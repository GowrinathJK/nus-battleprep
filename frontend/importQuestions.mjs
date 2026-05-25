import { initializeApp } from "firebase/app";

import {
  getFirestore,
  collection,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzRA44ceQ594wxqT-6zrQuuCXhY7oMqzI",
  authDomain: "nus-battleprep.firebaseapp.com",
  projectId: "nus-battleprep",
  storageBucket: "nus-battleprep.firebasestorage.app",
  messagingSenderId: "887481925547",
  appId: "1:887481925547:web:1df2501915366232965cee",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const questions = [
  {
    module: "CS2030S",
    topic: "Streams",
    difficulty: "Easy",
    question: "What does map() do in Java Streams?",
    options: [
      "Transforms elements",
      "Filters elements",
      "Sorts elements",
      "Deletes elements"
    ],
    answer: "Transforms elements"
  },

  {
    module: "CS2030S",
    topic: "OOP",
    difficulty: "Easy",
    question: "What does encapsulation mean?",
    options: [
      "Hiding data",
      "Inheritance",
      "Looping",
      "Sorting"
    ],
    answer: "Hiding data"
  },

  {
    module: "CS2030S",
    topic: "Generics",
    difficulty: "Easy",
    question: "Why are generics used in Java?",
    options: [
      "Type safety",
      "Faster internet",
      "Graphics rendering",
      "Memory cleaning"
    ],
    answer: "Type safety"
  },

  {
    module: "CS2030S",
    topic: "Lambda",
    difficulty: "Easy",
    question: "What is a lambda expression mainly used for?",
    options: [
      "Functional programming",
      "File compression",
      "Database indexing",
      "Networking"
    ],
    answer: "Functional programming"
  }
];

async function uploadQuestions() {
  for (const question of questions) {
    await addDoc(collection(db, "questions"), question);

    console.log("Uploaded:", question.question);
  }

  console.log("DONE");
}

uploadQuestions();