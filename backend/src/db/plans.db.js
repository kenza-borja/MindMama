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

export async function mergeDays(planId, newDays) {
  const db = getDb();
  const planSnap = await db.collection(COLLECTION).doc(planId).get();
  if (!planSnap.exists) throw new Error("Plan not found");

  const plan = planSnap.data();
  const existing = plan.days || [];
  const existingDates = new Set(existing.map(d => d.date));

  const toAdd = newDays.filter(d => !existingDates.has(d.date));
  if (toAdd.length === 0) return getPlan(planId);

  await db.collection(COLLECTION).doc(planId).update({
    days: [...existing, ...toAdd],
  });
  return getPlan(planId);
}

export async function addMeal(planId, date, mealObj) {
  const db = getDb();
  const planSnap = await db.collection(COLLECTION).doc(planId).get();

  if (!planSnap.exists) throw new Error("Plan not found");
  const plan = planSnap.data();

  console.log(`[addMeal] id=${planId} date="${date}" label="${mealObj.label}" days_before=${JSON.stringify(plan.days?.map(d => ({ date: d.date, n: d.meals?.length })))}`);

  const existingDays = plan.days || [];
  const dayExists = existingDays.some(d => d.date === date);

  let updatedDays;
  if (!dayExists) {
    // Day not in plan yet (editing an existing plan to add new days)
    updatedDays = [...existingDays, { date, meals: [mealObj] }];
  } else {
    updatedDays = existingDays.map(day => {
      if (day.date !== date) return day;
      const existingMeals = (day.meals || []).map(m =>
        typeof m === "string" ? { label: m } : m
      );
      const filtered = existingMeals.filter(m => m.label !== mealObj.label);
      return { ...day, meals: [...filtered, mealObj] };
    });
  }

  console.log(`[addMeal] days_after=${JSON.stringify(updatedDays.map(d => ({ date: d.date, n: d.meals?.length })))}`);

  await db.collection(COLLECTION).doc(planId).update({ days: updatedDays });
  return getPlan(planId);
}
