# Deploying MindMama

Goal: MindMama installed on an iPhone home screen, running without the laptop.

Three pieces go up: the AI service, the Node API, and the web app. Firestore is
already hosted.

The web app installs as a PWA. It gets an icon, launches fullscreen with no
browser chrome, and appears in the app switcher. It is not an App Store app and
cannot be one without a paid Apple Developer account.

---

## 1. Push the repo to GitHub

Render and Vercel both deploy from a Git remote.

```powershell
git remote -v          # if this prints nothing, create a repo on github.com first
git push -u origin main
```

Secrets are safe to push: `.env` files are gitignored and no service account
has ever been committed.

## 2. Deploy the backend and AI service (Render)

1. Sign up at render.com, connect the GitHub repo
2. **New > Blueprint**, select the repo. Render reads `render.yaml` and creates
   both services
3. Fill in the env vars it asks for:

   **mindmama-ai**
   - `GROQ_API_KEY` - from the root `.env`
   - `GROQ_MODEL` - from the root `.env`

   **mindmama-api**
   - `AI_URL` - the AI service's URL, shown once it deploys
   - `FIREBASE_SERVICE_ACCOUNT` - from `backend/.env`, one line
   - `ALLOWED_ORIGINS` - leave blank until step 3, then set it to the Vercel URL
   - `API_KEY` - Render generates this. Copy the value, it is needed next

4. Check it is alive: `https://mindmama-api.onrender.com/health` returns
   `{"ok":true}`

## 3. Deploy the web app (Vercel)

1. Sign up at vercel.com, import the same repo
2. Settings:
   - Root directory: `frontend`
   - Build command: `npm run build:web`
   - Output directory: `dist`
3. Environment variables:
   - `EXPO_PUBLIC_API_URL` - the Render API URL, e.g.
     `https://mindmama-api.onrender.com`
   - `EXPO_PUBLIC_API_KEY` - the `API_KEY` value from step 2
4. Deploy, then go back to Render and set `ALLOWED_ORIGINS` on **mindmama-api**
   to the Vercel URL. Without this the browser blocks every API call.

## 4. Install on the iPhone

1. Open the Vercel URL in **Safari** (not Chrome - only Safari can install to
   the home screen on iOS)
2. Tap **Share**
3. Tap **Add to Home Screen**
4. Name it, tap **Add**

It now launches fullscreen from the home screen icon.

---

## Things worth knowing

**Free tier sleeps.** Render free services stop after 15 minutes idle and take
around 50 seconds to wake. The first open after a gap is slow; the rest are
normal. Around $7/month per service removes this.

**Both Render services must be awake.** The API calls the AI service, so an
AI-backed action after a long gap waits for two cold starts.

**Changing the API key.** Update it in both places or the app gets 401s: Render
`API_KEY` on mindmama-api, and Vercel `EXPO_PUBLIC_API_KEY`.

**Updates.** Push to `main`. Render and Vercel both rebuild automatically. On
the phone, close the app and reopen it to pick up the new version.

---

## Known gap: the AI service is unauthenticated

`mindmama-api` requires `x-api-key`. `mindmama-ai` does not - anyone who finds
its URL can call it and spend Groq tokens on the project key.

It is only reachable if someone discovers the URL, and the Node API is the only
intended caller. Two ways to close it:

- Add the same shared-secret check to the FastAPI app and have the Node service
  send the header
- Or on Render, make `mindmama-ai` a Private Service so only the API can reach
  it (paid feature)

Worth doing before the URL is shared anywhere.
