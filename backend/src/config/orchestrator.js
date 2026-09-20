import axios from "axios";
import { getEnv } from "./env.js";

const env = getEnv();

console.log("AI_URL from env:", JSON.stringify(env.AI_URL));

export const aiClient = axios.create({
  baseURL: env.AI_URL,
  timeout: 20000,
  // The AI service rejects unauthenticated calls in deployed environments.
  // Unset locally, where that service skips the check.
  headers: env.AI_API_KEY ? { "x-api-key": env.AI_API_KEY } : {},
});
