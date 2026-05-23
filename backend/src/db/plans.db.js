import { getDb } from "../config/firebase.js";

const COLLECTION = "plans";

export async function createPlan(plan) {
  const db = getDb();
  const ref = await db.collection(COLLECTION).add(plan);
  const snap = await ref.get();
  return { id: snap.id, ...snap.data() };
}

export async function getPlan(id) {
  const db = getDb();
  const snap = await db.collection(COLLECTION).doc(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
}

export async function updatePlan(id, data) {
  const db = getDb();
  await db.collection(COLLECTION).doc(id).update(data);
  return getPlan(id);
}

export async function addMeal(planId, date, mealObj) {
  const db = getDb();
  const planSnap = await db.collection(COLLECTION).doc(planId).get();

  if (!planSnap.exists) throw new Error("Plan not found");
  const plan = planSnap.data();

  console.log(`[addMeal] id=${planId} date="${date}" label="${mealObj.label}" days_before=${JSON.stringify(plan.days?.map(d => ({ date: d.date, meals: d.meals?.length })))}`);

  const updatedDays = (plan.days || []).map(day => {
    if (day.date !== date) return day;

    const existingMeals = (day.meals || []).map(m =>
      typeof m === "string" ? { label: m } : m
    );
    const filtered = existingMeals.filter(m => m.label !== mealObj.label);

    return { ...day, meals: [...filtered, mealObj] };
  });

  console.log(`[addMeal] days_after=${JSON.stringify(updatedDays.map(d => ({ date: d.date, meals: d.meals?.length })))}`);

  await db.collection(COLLECTION).doc(planId).update({ days: updatedDays });
  return getPlan(planId);
}
