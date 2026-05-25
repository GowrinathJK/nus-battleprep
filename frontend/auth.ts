import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "./firebase";

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(
      auth,
      provider
    );

    const user = result.user;

    const userRef = doc(
      db,
      "users",
      user.uid
    );

    const existingUser = await getDoc(
      userRef
    );

    if (!existingUser.exists()) {
      await setDoc(userRef, {
        uid: user.uid,

        name: user.displayName,

        email: user.email,

        xp: 0,

        elo: 1000,

        wins: 0,

        losses: 0,

        streak: 0,

        lastQuizDate: "",
      });
    }

    return user;
  } catch (error) {
    console.error(
      "Login Error:",
      error
    );

    return null;
  }
}