import dotenv from "dotenv";
dotenv.config();

export function getEnv() {
  return {
    PORT: process.env.PORT || 4000,
    AI_URL: process.env.AI_URL,

    // Shared secret the app must send as x-api-key. Unset locally, required
    // in any deployed environment.
    API_KEY: process.env.API_KEY,

    // Comma-separated origins allowed to call the API from a browser.
    // Unset means allow any origin, which is what local dev wants.
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,

    FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT
  };
}
