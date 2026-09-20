/**
 * Base64 encode a Firebase service account JSON file for use as
 * FIREBASE_SERVICE_ACCOUNT_B64.
 *
 * Usage:
 *   npm run encode-key -- path\to\serviceAccount.json
 *
 * Prints only the encoded value, so it can be piped to the clipboard:
 *   npm run encode-key -- key.json | clip
 *
 * The decoded contents are never printed. Do not paste the output into
 * chat, an issue, or a commit - it is a private key.
 */
import { readFile } from "node:fs/promises";

const path = process.argv[2];

if (!path) {
  console.error("Usage: npm run encode-key -- path/to/serviceAccount.json");
  process.exit(1);
}

let raw;
try {
  raw = await readFile(path, "utf8");
} catch (err) {
  console.error(`Could not read ${path}: ${err.code ?? err.message}`);
  process.exit(1);
}

let parsed;
try {
  parsed = JSON.parse(raw);
} catch {
  console.error(`${path} is not valid JSON. Is it the file Google gave you?`);
  process.exit(1);
}

if (!parsed.project_id || !parsed.private_key) {
  console.error(
    `${path} is missing project_id or private_key, so it is not a service ` +
      `account key.`
  );
  process.exit(1);
}

process.stdout.write(Buffer.from(raw, "utf8").toString("base64"));
