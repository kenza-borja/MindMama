import axios from "axios";
import { getEnv } from "./env.js";

const env = getEnv();

console.log("AI_URL from env:", JSON.stringify(env.AI_URL));

export const aiClient = axios.create({
  baseURL: env.AI_URL,
  timeout: 20000,
});
