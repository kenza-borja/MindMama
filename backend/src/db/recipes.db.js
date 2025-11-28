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

export async function listRecipes() {
  const db = getDb();
  const snap = await db.collection(COLLECTION).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Load multiple recipes by their Firestore document IDs.
 * Simple loop – fine for small plans.
 */
export async function getRecipesByIds(ids) {
  if (!ids || ids.length === 0) return [];

  const db = getDb();
  const collectionRef = db.collection(COLLECTION);

  const recipes = [];

  for (const id of ids) {
    const snap = await collectionRef.doc(id).get();
    if (snap.exists) {
      recipes.push({ id: snap.id, ...snap.data() });
    }
  }

  return recipes;
}