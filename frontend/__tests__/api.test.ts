// Mock fetch globally before importing the module
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

// Mock AsyncStorage (not needed for api.ts but avoids any side-effect import errors)
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

import {
  getPlan,
  createPlan,
  listRecipes,
  mergePlanDays,
  addAiMealToPlan,
} from "../lib/api";

function mockResponse(status: number, body: any) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Response;
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe("handleResponse behaviour via listRecipes", () => {
  test("resolves with JSON body on 200", async () => {
    const fakeRecipes = [{ id: "1", title: "Chicken Tagine" }];
    mockFetch.mockResolvedValue(mockResponse(200, fakeRecipes));

    const result = await listRecipes();
    expect(result).toEqual(fakeRecipes);
  });

  test("throws on 404 with error message from response body", async () => {
    mockFetch.mockResolvedValue(mockResponse(404, { error: "Not found" }));

    await expect(listRecipes()).rejects.toThrow("Not found");
  });

  test("throws generic Error message on 500 with no body error field", async () => {
    mockFetch.mockResolvedValue(mockResponse(500, {}));

    await expect(listRecipes()).rejects.toThrow("Error 500");
  });
});

describe("getPlan", () => {
  test("calls GET /plans/:id and returns plan data", async () => {
    const fakePlan = { id: "abc", days: [] };
    mockFetch.mockResolvedValue(mockResponse(200, fakePlan));

    const result = await getPlan("abc");
    expect(result).toEqual(fakePlan);
    // Every request goes through apiFetch, which always passes an init
    // object so the API key header can be attached.
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/plans/abc"),
      expect.any(Object)
    );
  });

  test("throws when plan not found (404)", async () => {
    mockFetch.mockResolvedValue(mockResponse(404, { error: "Plan not found" }));
    await expect(getPlan("missing")).rejects.toThrow("Plan not found");
  });
});

describe("mergePlanDays", () => {
  test("sends PATCH to the right URL with correct body", async () => {
    const updated = { id: "abc", days: [{ date: "Monday", meals: ["Lunch"] }] };
    mockFetch.mockResolvedValue(mockResponse(200, updated));

    const days = [{ date: "Monday", meals: ["Lunch"] }];
    const result = await mergePlanDays("abc", days);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/plans/abc/days"),
      expect.objectContaining({
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days }),
      })
    );
    expect(result).toEqual(updated);
  });
});

describe("addAiMealToPlan", () => {
  test("sends POST to /plans/:id/meals/ai with correct payload", async () => {
    const updatedPlan = { id: "abc", days: [] };
    mockFetch.mockResolvedValue(mockResponse(200, updatedPlan));

    const payload = {
      date: "Monday",
      label: "Dinner",
      preferences: { num_people: 2, time_available: 30, dietary_restrictions: ["Halal"], preferences_text: "" },
    };

    const result = await addAiMealToPlan("abc", payload);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/plans/abc/meals/ai"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    );
    expect(result).toEqual(updatedPlan);
  });

  test("throws when AI endpoint returns error", async () => {
    mockFetch.mockResolvedValue(mockResponse(422, { error: "AI generation failed" }));

    await expect(
      addAiMealToPlan("abc", { date: "Monday", label: "Lunch" })
    ).rejects.toThrow("AI generation failed");
  });
});

describe("createPlan", () => {
  test("sends POST to /plans with the plan payload", async () => {
    const newPlan = { id: "xyz", days: [] };
    mockFetch.mockResolvedValue(mockResponse(201, newPlan));

    const payload = {
      startDate: "2026-05-23",
      days: [{ date: "Monday", meals: ["Lunch"] }],
    };

    const result = await createPlan(payload);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/plans"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(payload),
      })
    );
    expect(result).toEqual(newPlan);
  });
});
