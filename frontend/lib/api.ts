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

// Shared secret for the deployed API. Unset locally, where the backend
// skips the check.
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

/**
 * fetch with the API key attached. Every call goes through here so the
 * header can't be forgotten at a new call site.
 */
function apiFetch(url: string, init: RequestInit = {}) {
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> | undefined),
  };
  if (API_KEY) headers["x-api-key"] = API_KEY;
  return fetch(url, { ...init, headers });
}
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
  const res = await apiFetch(`${API_BASE_URL}/plans`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getPlan(planId: string) {
  const res = await apiFetch(`${API_BASE_URL}/plans/${planId}`);
  return handleResponse(res);
}

export async function mergePlanDays(
  planId: string,
  days: { date: string; meals: string[] }[]
) {
  const res = await apiFetch(`${API_BASE_URL}/plans/${planId}/days`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ days }),
  });
  return handleResponse(res);
}

export async function addSavedMealToPlan(planId: string, payload: AddMealPayload) {
  const res = await apiFetch(`${API_BASE_URL}/plans/${planId}/meals/saved`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function addAiMealToPlan(planId: string, payload: AddMealPayload) {
  const res = await apiFetch(`${API_BASE_URL}/plans/${planId}/meals/ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function listRecipes() {
  const res = await apiFetch(`${API_BASE_URL}/recipes`);
  return handleResponse(res);
}

export async function createRecipe(payload: CreateRecipePayload) {
  const res = await apiFetch(`${API_BASE_URL}/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getShoppingList(planId: string) {
  const res = await apiFetch(`${API_BASE_URL}/shopping-list/${planId}`, {
    method: "POST",
  });
  return handleResponse(res);
}
