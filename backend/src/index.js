import app from "./app.js";
import { initFirebase } from "./config/firebase.js";
import { getEnv } from "./config/env.js";

const env = getEnv();
const PORT = env.PORT || 4000;

initFirebase();

app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
