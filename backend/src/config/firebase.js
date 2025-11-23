import admin from "firebase-admin";
import { getEnv } from "./env.js";

let db = null;

export function initFirebase() {
  const env = getEnv();

  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  db = admin.firestore();
  return db;
}

export function getDb() {
  if (!db) throw new Error("Firestore not initialized");
  return db;
}
