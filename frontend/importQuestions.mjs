// Usage: node importQuestions.mjs path/to/questions.json

import { initializeApp } from "firebase/app";
import { getFirestore, collection, writeBatch, doc } from "firebase/firestore";
import { readFileSync } from "fs";
import { resolve } from "path";

const firebaseConfig = {
  apiKey: "AIzaSyBzRA44ceQ594wxqT-6zrQuuCXhY7oMqzI",
  authDomain: "nus-battleprep.firebaseapp.com",
  projectId: "nus-battleprep",
  storageBucket: "nus-battleprep.firebasestorage.app",
  messagingSenderId: "887481925547",
  appId: "1:887481925547:web:1df2501915366232965cee",
  databaseURL: "https://nus-battleprep-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node importQuestions.mjs path/to/questions.json");
  process.exit(1);
}

const questions = JSON.parse(readFileSync(resolve(filePath), "utf-8"));
console.log(`Importing ${questions.length} questions...`);

const BATCH_SIZE = 499;
let imported = 0;

for (let i = 0; i < questions.length; i += BATCH_SIZE) {
  const batch = writeBatch(db);
  const chunk = questions.slice(i, i + BATCH_SIZE);
  for (const q of chunk) {
    const docRef = doc(collection(db, "questions"));
    batch.set(docRef, {
      module: q.module,
      topic: q.topic,
      scope: q.scope || "",
      difficulty: q.difficulty,
      question: q.question,
      options: q.options,
      answer: q.answer,
    });
  }
  await batch.commit();
  imported += chunk.length;
  console.log(`  ✓ ${imported}/${questions.length} imported`);
}

console.log("Done!");
process.exit(0);