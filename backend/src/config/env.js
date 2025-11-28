import dotenv from "dotenv";
dotenv.config();

export function getEnv() {
  return {
    PORT: process.env.PORT || 4000,
    AI_URL: process.env.AI_URL,

    FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT
  };
}
