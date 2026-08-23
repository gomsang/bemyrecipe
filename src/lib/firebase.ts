import { getApp, getApps, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, signInWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { collection, getDocs, getFirestore, orderBy, query } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import type { User } from "firebase/auth";
import { canonicalRecipeId } from "../../shared/catalog-route";
import type { CatalogRecipe } from "./types";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId);
const app = firebaseConfigured ? (getApps().length ? getApp() : initializeApp(config)) : null;
export const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const functions = app ? getFunctions(app, "asia-northeast3") : null;

export async function login(email: string, password: string) {
  if (!auth) throw new Error("Firebase Web App 설정이 아직 연결되지 않았습니다.");
  return signInWithEmailAndPassword(auth, email, password);
}

export async function register(email: string, password: string) {
  if (!auth) throw new Error("Firebase Web App 설정이 아직 연결되지 않았습니다.");
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(credential.user);
  await firebaseSignOut(auth);
}

export async function logout() {
  if (auth) await firebaseSignOut(auth);
}

export async function callServer<TInput, TResult>(name: string, data?: TInput): Promise<TResult> {
  if (!functions) throw new Error("Firebase Functions 설정이 아직 연결되지 않았습니다.");
  const callable = httpsCallable<TInput, TResult>(functions, name);
  return (await callable(data as TInput)).data;
}

export async function loadPublicRecipes(): Promise<CatalogRecipe[]> {
  if (!db) return [];
  const snapshot = await getDocs(query(collection(db, "recipes"), orderBy("created", "desc")));
  return snapshot.docs.map((document) => {
    const recipe = document.data() as CatalogRecipe & { localId?: string };
    return { ...recipe, id: canonicalRecipeId(recipe) };
  });
}

export type AuthUser = User;
