import axios from "axios";

const API_BASE_URL = "http://192.xxx.x.xxx:4000"; // change to your machine’s IP for phones

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

export async function getHealth() {
  try {
    const res = await api.get("/health");
    return res.data;
  } catch (err) {
    console.error("API error:", err.message);
    return { ok: false };
  }
}
