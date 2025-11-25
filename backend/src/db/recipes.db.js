import { getDb } from "../config/firebase.js";

const COLLECTION = "recipes";

export async function createRecipe(recipe) {
  const db = getDb();
  const ref = await db.collection(COLLECTION).add(recipe);
  return ref.id;
}

export async function getRecipe(id) {
  const db = getDb();
  const snap = await db.collection(COLLECTION).doc(id).get();
  return { id: snap.id, ...snap.data() };
}

export async function getRecipesByIds(ids) {
  const db = getDb();
  const results = {};

  for (const id of ids) {
    const snap = await db.collection(COLLECTION).doc(id).get();
    if (snap.exists) results[id] = { id, ...snap.data() };
  }

  return results;
}

export async function listRecipes() {
  const db = getDb();
  const snap = await db.collection(COLLECTION).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
