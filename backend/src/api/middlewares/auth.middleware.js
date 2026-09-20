import { timingSafeEqual } from "node:crypto";

import { getEnv } from "../../config/env.js";

function secretsMatch(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/**
 * Single-user shared-secret check.
 *
 * Once the API is public, anything that reaches it can read and write the
 * Firestore data and spend Groq tokens on the project's key. The app sends
 * API_KEY as x-api-key on every request; everything else is rejected.
 *
 * With no API_KEY configured the check is skipped, so local development
 * keeps working without extra setup. Deployed environments must set it.
 */
export function authMiddleware(req, res, next) {
  const { API_KEY } = getEnv();

  if (!API_KEY) return next();

  const provided = req.get("x-api-key");
  if (!provided || !secretsMatch(provided, API_KEY)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}
