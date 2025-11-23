import axios from "axios";
import { getEnv } from "./env.js";

const env = getEnv();

export const aiClient = axios.create({
  baseURL: env.AI_URL,
  timeout: 20000,
});
