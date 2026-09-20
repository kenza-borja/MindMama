// Tests for the category order sorting logic used in ShoppingListScreen

const CATEGORY_ORDER = [
  "Meat & Poultry",
  "Fish & Seafood",
  "Vegetables",
  "Fruit",
  "Dairy & Eggs",
  "Grains & Carbs",
  "Legumes",
  "Spices & Herbs",
  "Pantry",
  "Other",
];

function sortCategories(categories: string[]): string[] {
  return [...categories].sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a);
    const ib = CATEGORY_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

describe("CATEGORY_ORDER sorting", () => {
  test("sorts Meat & Poultry before Vegetables", () => {
    const input = ["Vegetables", "Meat & Poultry"];
    const sorted = sortCategories(input);
    expect(sorted[0]).toBe("Meat & Poultry");
    expect(sorted[1]).toBe("Vegetables");
  });

  test("sorts all known categories in the defined order", () => {
    const shuffled = [
      "Other",
      "Pantry",
      "Spices & Herbs",
      "Legumes",
      "Grains & Carbs",
      "Dairy & Eggs",
      "Fruit",
      "Vegetables",
      "Fish & Seafood",
      "Meat & Poultry",
    ];
    const sorted = sortCategories(shuffled);
    expect(sorted).toEqual(CATEGORY_ORDER);
  });

  test("puts unknown categories at the end", () => {
    const input = ["Vegetables", "Unknown Category", "Meat & Poultry"];
    const sorted = sortCategories(input);
    expect(sorted[sorted.length - 1]).toBe("Unknown Category");
    expect(sorted[0]).toBe("Meat & Poultry");
    expect(sorted[1]).toBe("Vegetables");
  });

  test("sorts multiple unknown categories alphabetically among themselves", () => {
    const input = ["Zipper Pouches", "Apricot Jam", "Vegetables"];
    const sorted = sortCategories(input);
    expect(sorted[0]).toBe("Vegetables");
    expect(sorted[1]).toBe("Apricot Jam");
    expect(sorted[2]).toBe("Zipper Pouches");
  });

  test("handles single category", () => {
    expect(sortCategories(["Pantry"])).toEqual(["Pantry"]);
  });

  test("handles empty array", () => {
    expect(sortCategories([])).toEqual([]);
  });

  test("Spices & Herbs comes before Pantry", () => {
    const input = ["Pantry", "Spices & Herbs"];
    const sorted = sortCategories(input);
    expect(sorted[0]).toBe("Spices & Herbs");
  });

  test("Fish & Seafood comes before Dairy & Eggs", () => {
    const input = ["Dairy & Eggs", "Fish & Seafood"];
    const sorted = sortCategories(input);
    expect(sorted[0]).toBe("Fish & Seafood");
  });

  test("Other always comes last among known categories", () => {
    const input = ["Other", "Grains & Carbs", "Legumes"];
    const sorted = sortCategories(input);
    expect(sorted[sorted.length - 1]).toBe("Other");
  });

  test("duplicate categories are preserved", () => {
    const input = ["Vegetables", "Vegetables", "Meat & Poultry"];
    const sorted = sortCategories(input);
    expect(sorted[0]).toBe("Meat & Poultry");
    expect(sorted[1]).toBe("Vegetables");
    expect(sorted[2]).toBe("Vegetables");
  });
});
