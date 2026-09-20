import { NativeModules, Platform } from "react-native";

const API_PORT = 4000;

function resolveApiBaseUrl(): string {
  // An explicit value always wins: production builds, tunnels, staging.
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;

  // Dev: reuse whatever host served the JS bundle. On a phone that is this
  // machine's current LAN IP, so a new DHCP lease can't break the app.
  const scriptURL: unknown = NativeModules?.SourceCode?.scriptURL;
  if (typeof scriptURL === "string") {
    const host = scriptURL.match(/^https?:\/\/([^/:]+)/)?.[1];
    if (host) return `http://${host}:${API_PORT}`;
  }

  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `http://${window.location.hostname}:${API_PORT}`;
  }

  return `http://localhost:${API_PORT}`;
}

const API_BASE_URL = resolveApiBaseUrl();
type PlanPayload = {
  startDate: string;
  days: { date: string; meals: string[] }[];
};

type AddMealPayload = {
  date: string;
  label: string;
  recipeId?: string;
  preferences?: any;
};

export type Recipe = {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  prep_time?: number;
  cook_time?: number;
  source?: string;
};

type CreateRecipePayload = {
  title: string;
  ingredients: string[];
  steps: string[];
  prep_time?: number;
  cook_time?: number;
};


async function handleResponse(res: Response) {
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const d = await res.json();
      if (d?.error) msg = d.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function createPlan(payload: PlanPayload) {
  const res = await fetch(`${API_BASE_URL}/plans`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getPlan(planId: string) {
  const res = await fetch(`${API_BASE_URL}/plans/${planId}`);
  return handleResponse(res);
}

export async function mergePlanDays(
  planId: string,
  days: { date: string; meals: string[] }[]
) {
  const res = await fetch(`${API_BASE_URL}/plans/${planId}/days`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ days }),
  });
  return handleResponse(res);
}

export async function addSavedMealToPlan(planId: string, payload: AddMealPayload) {
  const res = await fetch(`${API_BASE_URL}/plans/${planId}/meals/saved`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function addAiMealToPlan(planId: string, payload: AddMealPayload) {
  const res = await fetch(`${API_BASE_URL}/plans/${planId}/meals/ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function listRecipes() {
  const res = await fetch(`${API_BASE_URL}/recipes`);
  return handleResponse(res);
}

export async function createRecipe(payload: CreateRecipePayload) {
  const res = await fetch(`${API_BASE_URL}/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getShoppingList(planId: string) {
  const res = await fetch(`${API_BASE_URL}/shopping-list/${planId}`, {
    method: "POST",
  });
  return handleResponse(res);
}
