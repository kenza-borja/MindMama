// This package is ESM, so the jest object is imported rather than global.
import { jest } from "@jest/globals";

import { authMiddleware } from "../src/api/middlewares/auth.middleware.js";

function fakeReq(apiKey) {
  return { get: (name) => (name === "x-api-key" ? apiKey : undefined) };
}

function fakeRes() {
  const res = { statusCode: null, body: null };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    res.body = payload;
    return res;
  };
  return res;
}

const ORIGINAL_KEY = process.env.API_KEY;

afterEach(() => {
  if (ORIGINAL_KEY === undefined) delete process.env.API_KEY;
  else process.env.API_KEY = ORIGINAL_KEY;
});

describe("authMiddleware", () => {
  test("allows the request through when API_KEY is not configured", () => {
    delete process.env.API_KEY;
    const next = jest.fn();
    const res = fakeRes();

    authMiddleware(fakeReq(undefined), res, next);

    expect(next).toHaveBeenCalled();
    expect(res.statusCode).toBeNull();
  });

  test("allows the request through when the key matches", () => {
    process.env.API_KEY = "correct-horse";
    const next = jest.fn();
    const res = fakeRes();

    authMiddleware(fakeReq("correct-horse"), res, next);

    expect(next).toHaveBeenCalled();
    expect(res.statusCode).toBeNull();
  });

  test("rejects with 401 when the key is wrong", () => {
    process.env.API_KEY = "correct-horse";
    const next = jest.fn();
    const res = fakeRes();

    authMiddleware(fakeReq("battery-staple"), res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: "Unauthorized" });
  });

  test("rejects with 401 when the header is missing entirely", () => {
    process.env.API_KEY = "correct-horse";
    const next = jest.fn();
    const res = fakeRes();

    authMiddleware(fakeReq(undefined), res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(401);
  });

  test("rejects a key of a different length without throwing", () => {
    // timingSafeEqual throws on length mismatch, so the length check has to
    // come first.
    process.env.API_KEY = "correct-horse";
    const next = jest.fn();
    const res = fakeRes();

    expect(() => authMiddleware(fakeReq("short"), res, next)).not.toThrow();
    expect(res.statusCode).toBe(401);
  });
});
