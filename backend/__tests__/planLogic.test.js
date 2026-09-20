// Pure function tests for day-merging logic (no Firestore needed)

function mergeDaysLogic(existingDays, newDays) {
  const existingDates = new Set(existingDays.map(d => d.date));
  return [...existingDays, ...newDays.filter(d => !existingDates.has(d.date))];
}

describe("mergeDaysLogic", () => {
  test("adds new days to an empty existing plan", () => {
    const existing = [];
    const newDays = [
      { date: "Monday", meals: ["Lunch"] },
      { date: "Tuesday", meals: ["Dinner"] },
    ];
    const result = mergeDaysLogic(existing, newDays);
    expect(result).toHaveLength(2);
    expect(result[0].date).toBe("Monday");
    expect(result[1].date).toBe("Tuesday");
  });

  test("appends new days to existing days", () => {
    const existing = [{ date: "Monday", meals: ["Lunch"] }];
    const newDays = [{ date: "Wednesday", meals: ["Breakfast"] }];
    const result = mergeDaysLogic(existing, newDays);
    expect(result).toHaveLength(2);
    expect(result[1].date).toBe("Wednesday");
  });

  test("skips duplicate days that already exist", () => {
    const existing = [
      { date: "Monday", meals: ["Lunch"] },
      { date: "Tuesday", meals: ["Dinner"] },
    ];
    const newDays = [
      { date: "Monday", meals: ["Breakfast"] }, // duplicate
      { date: "Friday", meals: ["Lunch"] },
    ];
    const result = mergeDaysLogic(existing, newDays);
    expect(result).toHaveLength(3);
    // Monday meal should remain the original one
    const monday = result.find(d => d.date === "Monday");
    expect(monday.meals).toEqual(["Lunch"]);
  });

  test("handles empty newDays — returns existing unchanged", () => {
    const existing = [{ date: "Monday", meals: ["Lunch"] }];
    const result = mergeDaysLogic(existing, []);
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe("Monday");
  });

  test("handles both arrays empty", () => {
    const result = mergeDaysLogic([], []);
    expect(result).toHaveLength(0);
  });

  test("all new days are duplicates — result equals existing", () => {
    const existing = [
      { date: "Monday", meals: ["Lunch"] },
      { date: "Tuesday", meals: ["Dinner"] },
    ];
    const newDays = [
      { date: "Monday", meals: ["Breakfast"] },
      { date: "Tuesday", meals: ["Snacks"] },
    ];
    const result = mergeDaysLogic(existing, newDays);
    expect(result).toHaveLength(2);
    // Existing meals preserved
    expect(result[0].meals).toEqual(["Lunch"]);
    expect(result[1].meals).toEqual(["Dinner"]);
  });

  test("preserves order — existing days come first, then new days", () => {
    const existing = [{ date: "Friday", meals: ["Dinner"] }];
    const newDays = [
      { date: "Monday", meals: ["Lunch"] },
      { date: "Wednesday", meals: ["Breakfast"] },
    ];
    const result = mergeDaysLogic(existing, newDays);
    expect(result[0].date).toBe("Friday");
    expect(result[1].date).toBe("Monday");
    expect(result[2].date).toBe("Wednesday");
  });

  test("multiple meal types are preserved correctly", () => {
    const existing = [];
    const newDays = [
      { date: "Monday", meals: ["Breakfast", "Lunch", "Dinner"] },
    ];
    const result = mergeDaysLogic(existing, newDays);
    expect(result[0].meals).toEqual(["Breakfast", "Lunch", "Dinner"]);
  });
});
