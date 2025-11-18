# MindMama

mobile/ → React Native (Expo) app

api/ → Node.js + Express backend API

This README explains how to install, run, test, and develop both projects.

🚀 Requirements

Make sure you have these installed:

Node.js (LTS recommended)

npm or yarn

Git

Expo CLI (installed automatically when running npx expo)

Android device OR Android emulator (if running the mobile app)

Local network access (phone & laptop on same WiFi)

📦 Installation

Clone the project:

git clone <your-repo-url>
cd MindMama


Install dependencies for both apps:

API
cd api
npm install

Mobile App
cd ../mobile
npm install

▶️ Running the API (Backend)

Inside the api/ folder:

npm start


The backend will run at:

http://0.0.0.0:4000


If accessing it on your laptop:

http://localhost:4000


If accessing it from your phone:

http://YOUR_LAPTOP_IP:4000


(You can find your local IP by running ipconfig.)

▶️ Running the Mobile App

Inside the mobile/ folder:

npx expo start


Then choose one of these:

Press w to run in a browser

Press a to run on Android emulator

Scan the QR code with Expo Go on your physical phone

Make sure your phone and laptop are on the same WiFi and Norton/firewall is not blocking the local API port (4000).

🔌 Connecting Mobile App → API

In your mobile app’s configuration file (usually constants.js, .env, or inside fetch calls):

Set the backend base URL to your laptop’s IP:

export const API_URL = "http://YOUR_LAPTOP_IP:4000";


Example:

export const API_URL = "http://192.163.1.136:4000";

🧪 Testing

If you add tests later:

npm test


📝 Git Guidelines
Commit messages

Use simple, readable commit messages like:

feat: add API server setup
fix: backend not reachable on network
chore: clean up build folders
refactor: simplify API routes

Branch workflow

Create a branch

git checkout -b feature/something


Make changes, commit

git add .
git commit -m "feat: description of work"


Push

git push origin feature/something


Open a Pull Request

Write what you changed

Mention any issues it fixes

Include screenshots if needed


📣 Troubleshooting
Backend not reachable from phone

Ensure both devices are on same WiFi

Use your local IP, not localhost

Allow port 4000 through firewall

Disable or whitelist the API in Norton

Android emulator not detected

Start it manually from Android Studio:

Device Manager → Start Emulator

Expo app stuck loading

Clear Metro cache:

npx expo start --clear
