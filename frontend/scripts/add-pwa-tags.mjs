/**
 * Inject PWA tags into the exported index.html.
 *
 * `expo export -p web` generates index.html from its own template, so the
 * manifest link and the Apple meta tags that make iOS launch this fullscreen
 * (instead of in a Safari tab) have to be added afterwards. Run via
 * `npm run build:web`.
 */
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const INDEX = join(process.cwd(), "dist", "index.html");

const TAGS = `
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta name="theme-color" content="#7a5ba8" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="MindMama" />
`;

const html = await readFile(INDEX, "utf8");

if (html.includes('rel="manifest"')) {
  console.log("PWA tags already present, nothing to do.");
  process.exit(0);
}

// viewport-fit=cover lets the app draw into the notch/home-indicator area,
// which is what stops it looking like a web page in a box.
const withViewport = html.replace(
  '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />',
  '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />'
);

const out = withViewport.replace("</head>", `${TAGS}  </head>`);

if (out === withViewport) {
  console.error("Could not find </head> in dist/index.html — aborting.");
  process.exit(1);
}

await writeFile(INDEX, out, "utf8");
console.log("PWA tags injected into dist/index.html");
