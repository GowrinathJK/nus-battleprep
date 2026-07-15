import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "./firebase";

const provider = new GoogleAuthProvider();

async function createUserIfNotExists(user: any) {
  const userRef = doc(db, "users", user.uid);
  const existingUser = await getDoc(userRef);
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
}

export async function signInWithGoogle() {
  try {
    // try popup first
    const result = await signInWithPopup(auth, provider);
    await createUserIfNotExists(result.user);
    return result.user;
  } catch (error: any) {
    if (
      error.code === "auth/popup-blocked" ||
      error.code === "auth/popup-closed-by-user"
    ) {
      // fallback to redirect if popup is blocked
      await signInWithRedirect(auth, provider);
      return null;
    }
    console.error("Login Error:", error);
    return null;
  }
}

export async function handleGoogleRedirect() {
  try {
    const result = await getRedirectResult(auth);
    if (!result) return null;
    await createUserIfNotExists(result.user);
    return result.user;
  } catch (error) {
    console.error("Redirect Error:", error);
    return null;
  }
}