import admin from "firebase-admin";
import { getEnv } from "./env.js";

let db = null;

/**
 * Read the service account from the environment.
 *
 * Prefers FIREBASE_SERVICE_ACCOUNT_B64, because the raw JSON contains
 * embedded newlines in the private key and dashboards and shells mangle it
 * in ways that are painful to diagnose. Raw JSON still works for local dev.
 *
 * Parse failures must not print the value: it is a private key, and crash
 * output lands in deploy logs.
 */
function loadServiceAccount(env) {
  const { FIREBASE_SERVICE_ACCOUNT_B64, FIREBASE_SERVICE_ACCOUNT } = env;

  let raw;
  let source;

  if (FIREBASE_SERVICE_ACCOUNT_B64) {
    raw = Buffer.from(FIREBASE_SERVICE_ACCOUNT_B64, "base64").toString("utf8");
    source = "FIREBASE_SERVICE_ACCOUNT_B64";
  } else if (FIREBASE_SERVICE_ACCOUNT) {
    raw = FIREBASE_SERVICE_ACCOUNT;
    source = "FIREBASE_SERVICE_ACCOUNT";
  } else {
    throw new Error(
      "No Firebase credentials. Set FIREBASE_SERVICE_ACCOUNT_B64 (preferred) " +
        "or FIREBASE_SERVICE_ACCOUNT."
    );
  }

  let parsed;
  try {
    parsed = JSON.parse(raw.trim());
  } catch {
    // The two variables are easy to mix up in a dashboard, and the failure
    // costs a full redeploy to discover. If the value decodes to JSON,
    // accept it whichever name it arrived under.
    try {
      parsed = JSON.parse(
        Buffer.from(raw.trim(), "base64").toString("utf8").trim()
      );
    } catch {
      throw new Error(
        `${source} is neither JSON nor base64-encoded JSON (length ` +
          `${raw.length}, starts with ${JSON.stringify(raw.slice(0, 6))}).`
      );
    }
  }

  if (!parsed.project_id || !parsed.private_key) {
    throw new Error(
      `${source} parsed but is missing project_id or private_key.`
    );
  }

  return parsed;
}

export function initFirebase() {
  const env = getEnv();

  if (!admin.apps.length) {
    const serviceAccount = loadServiceAccount(env);

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
