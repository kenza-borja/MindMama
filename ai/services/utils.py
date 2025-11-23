# app/services/utils.py
"""
Utilities: load canonical maps from project 'data' folder and provide
ingredient parsing, normalization, and shopping list aggregation.

Place the canonical JSON files at:
  <project_root>/data/CanonicalMap.json
  <project_root>/data/UnitNormalizationMap.json

This file provides:
- parse_ingredient(line)
- clean_ingredient_line(line)
- normalize_ingredients(list[str])
- aggregate_shopping_list(recipes: List[dict]) -> List[dict]
"""

import json
import re
from fractions import Fraction
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# -------------------------
# Locate project data folder (supports 'data' or 'Data')
# -------------------------
HERE = Path(__file__).resolve()
PROJECT_ROOT = HERE.parents[2] if len(HERE.parents) >= 2 else HERE.parent
DATA_DIRS = [PROJECT_ROOT / "data", PROJECT_ROOT / "Data", HERE.parent / "data", HERE.parent / "Data"]

def _find_data_file(filename: str) -> Optional[Path]:
    for d in DATA_DIRS:
        p = d / filename
        if p.exists():
            return p
    # fallback: try cwd
    cwd_p = Path.cwd() / filename
    if cwd_p.exists():
        return cwd_p
    return None

# -------------------------
# Load canonical maps
# -------------------------
CANONICAL_INGREDIENTS: Dict[str, Any] = {}
UNIT_MAP: List[Dict[str, Any]] = []

_ing_path = _find_data_file("CanonicalMap.json")
_units_path = _find_data_file("UnitNormalizationMap.json")

if _ing_path:
    with open(_ing_path, "r", encoding="utf-8") as f:
        CANONICAL_INGREDIENTS = json.load(f)
else:
    CANONICAL_INGREDIENTS = {}

if _units_path:
    with open(_units_path, "r", encoding="utf-8") as f:
        UNIT_MAP = json.load(f).get("units", [])
else:
    UNIT_MAP = []

# Pre-build lookup structures for fast normalization
_UNIT_VARIANT_TO_CANON: Dict[str, str] = {}
for unit_entry in UNIT_MAP:
    canon = unit_entry.get("canonical")
    for v in unit_entry.get("variations", []):
        _UNIT_VARIANT_TO_CANON[v.lower()] = canon

# Build ingredient variant -> canonical mapping (longer variants first)
_ING_VARIANTS: List[Tuple[str, str]] = []
for canonical, details in CANONICAL_INGREDIENTS.items():
    for var in details.get("variations", []):
        _ING_VARIANTS.append((var.lower(), canonical))
_ING_VARIANTS.sort(key=lambda t: -len(t[0]))

# -------------------------
# Parsing helpers
# -------------------------
_QTY_RE = re.compile(r"^\s*(\d+\s+\d+/\d+|\d+/\d+|\d+\.\d+|\d+)\b")

def _parse_quantity(leading_text: str) -> Tuple[Optional[float], str]:
    if not leading_text:
        return None, leading_text
    m = _QTY_RE.match(leading_text)
    if not m:
        return None, leading_text
    qty_str = m.group(1)
    rest = leading_text[m.end():].lstrip()
    try:
        if " " in qty_str and "/" in qty_str:
            whole, frac = qty_str.split()
            qty = float(whole) + float(Fraction(frac))
        elif "/" in qty_str:
            qty = float(Fraction(qty_str))
        else:
            qty = float(qty_str)
        return qty, rest
    except Exception:
        return None, leading_text

def _extract_unit_if_any(text: str) -> Tuple[Optional[str], str]:
    if not text:
        return None, text
    text_l = text.strip().lower()
    tokens = text_l.split()
    for length in (2, 1):
        candidate = " ".join(tokens[:length])
        if candidate in _UNIT_VARIANT_TO_CANON:
            # remove the candidate from original text robustly
            pattern = re.compile(re.escape(candidate), re.IGNORECASE)
            original = text.strip()
            m = pattern.match(original.lower())
            if m:
                remaining = original[m.end():].lstrip()
            else:
                # try to find first occurrence
                remaining = pattern.sub("", original, count=1).lstrip()
            return _UNIT_VARIANT_TO_CANON[candidate], remaining
    return None, text

# -------------------------
# Normalization functions
# -------------------------
def normalize_ingredient_name(text: str) -> str:
    if not text:
        return text
    t = text.lower()
    for variant, canonical in _ING_VARIANTS:
        if variant in t:
            pattern = re.compile(re.escape(variant), flags=re.IGNORECASE)
            new = pattern.sub(canonical, text, count=1)
            return re.sub(r"\s+", " ", new).strip()
    return text.strip()

def normalize_unit_in_text(text: str) -> str:
    # Replace the first unit variant occurrence with canonical if found
    if not text:
        return text
    # search for any variant
    for var, canon in _UNIT_VARIANT_TO_CANON.items():
        if re.search(r"\b" + re.escape(var) + r"\b", text, flags=re.IGNORECASE):
            return re.sub(r"\b" + re.escape(var) + r"\b", canon, text, flags=re.IGNORECASE, count=1)
    return text

def parse_ingredient(ingredient_line: str) -> Dict[str, Optional[Any]]:
    """
    Returns: { raw, quantity (float|None), unit (str|None), name (canonical if matched) }
    """
    if not ingredient_line:
        return {"raw": ingredient_line, "quantity": None, "unit": None, "name": ""}

    orig = ingredient_line.strip()
    remaining = orig

    qty, remaining = _parse_quantity(remaining)
    unit, remaining_after_unit = _extract_unit_if_any(remaining)
    if unit:
        remaining = remaining_after_unit

    name = remaining.strip()
    if name.lower().startswith("of "):
        name = name[3:].strip()

    # last chance: check for unit embedded in name (e.g., "1tbspolive oil")
    if unit is None:
        for var, canon in _UNIT_VARIANT_TO_CANON.items():
            if var in name.lower():
                unit = canon
                name = re.sub(r"\b" + re.escape(var) + r"\b", "", name, flags=re.IGNORECASE).strip()
                break

    canonical_name = normalize_ingredient_name(name)

    return {"raw": orig, "quantity": qty, "unit": unit, "name": canonical_name}

def render_ingredient(parsed: Dict[str, Optional[Any]]) -> str:
    name = parsed.get("name") or ""
    qty = parsed.get("quantity")
    unit = parsed.get("unit")

    if qty is None:
        return name

    try:
        if abs(qty - int(qty)) < 1e-9:
            qty_str = str(int(qty))
        else:
            frac = Fraction(qty).limit_denominator(8)
            if abs(float(frac) - qty) < 1e-6:
                if frac.numerator < frac.denominator:
                    qty_str = f"{frac.numerator}/{frac.denominator}"
                else:
                    qty_str = str(float(frac))
            else:
                qty_str = f"{round(qty,2)}"
    except Exception:
        qty_str = str(qty)

    if unit:
        return f"{qty_str} {unit} {name}"
    return f"{qty_str} {name}"

def clean_ingredient_line(line: str) -> str:
    parsed = parse_ingredient(line)
    return render_ingredient(parsed)

def normalize_ingredients(ingredients: List[str]) -> List[str]:
    out: List[str] = []
    for ing in ingredients:
        try:
            cleaned = clean_ingredient_line(ing)
            out.append(cleaned)
        except Exception:
            out.append(ing.strip().lower())
    return out

# -------------------------
# Aggregation: shopping list
# -------------------------
def aggregate_shopping_list(recipes: List[Dict]) -> List[Dict]:
    """
    Given a list of recipe dicts (each with 'ingredients': List[str]), return aggregated shopping list.
    Output: List of dicts: { name: canonical_name, total_qty: float|None, unit: str|None, category: str }
    Aggregation strategy:
      - Parse each ingredient line into (name, qty, unit)
      - Sum numeric quantities only for identical (name, unit)
      - If some entries have missing qty or conflicting units, total_qty is set to None for that (name, unit group)
      - Category is taken from canonical map if available, else 'uncategorized'
    """
    # map (name, unit) -> { total: float, has_unknown_qty: bool }
    aggregates: Dict[Tuple[str, Optional[str]], Dict[str, Any]] = {}

    for recipe in recipes:
        for line in recipe.get("ingredients", []) or []:
            parsed = parse_ingredient(line)
            name = (parsed.get("name") or "").strip()
            unit = parsed.get("unit")
            qty = parsed.get("quantity")

            key = (name, unit)
            if key not in aggregates:
                aggregates[key] = {"total": 0.0, "count": 0, "has_unknown_qty": False}

            if qty is None:
                # mark unknown qty
                aggregates[key]["has_unknown_qty"] = True
                aggregates[key]["count"] += 1
            else:
                try:
                    aggregates[key]["total"] += float(qty)
                    aggregates[key]["count"] += 1
                except Exception:
                    aggregates[key]["has_unknown_qty"] = True
                    aggregates[key]["count"] += 1

    # Build result list
    result: List[Dict[str, Optional[Any]]] = []
    for (name, unit), info in aggregates.items():
        canonical_name = name or ""
        # Lookup category
        category = "uncategorized"
        if canonical_name and canonical_name in CANONICAL_INGREDIENTS:
            category = CANONICAL_INGREDIENTS[canonical_name].get("category", "uncategorized")

        total_qty = None
        if info["has_unknown_qty"]:
            # If any unknown qty present, set total_qty to None (ambiguous)
            total_qty = None
        else:
            # All items had numeric qty; present the summed total
            total_qty = round(info["total"], 3) if info["total"] != 0 else None

        result.append({
            "name": canonical_name,
            "total_qty": total_qty,
            "unit": unit,
            "category": category
        })

    # Sort result: category then name (stable)
    result.sort(key=lambda x: (x.get("category") or "", x.get("name") or ""))
    return result

# -------------------------
# Optional: convenience function to create shopping list from recipes
# -------------------------
def shopping_list_from_recipes(recipes: List[Dict]) -> List[Dict]:
    """
    Wrapper: normalize ingredients first, then aggregate.
    """
    # normalize ingredient strings in-place if needed
    for recipe in recipes:
        if "ingredients" in recipe and isinstance(recipe["ingredients"], list):
            recipe["ingredients"] = normalize_ingredients(recipe["ingredients"])
    return aggregate_shopping_list(recipes)

# -------------------------
# Small smoke test when run directly
# -------------------------
if __name__ == "__main__":
    sample_recipes = [
        {
            "title": "Recipe A",
            "ingredients": ["2 vine tomatoes", "1 tbsp olive oil", "1 cup rice"]
        },
        {
            "title": "Recipe B",
            "ingredients": ["3 tomatoes", "2 tablespoons olive oil", "1 cup rice"]
        },
        {
            "title": "Recipe C",
            "ingredients": ["salt to taste", "1 cup rice"]
        }
    ]
    print("Loaded canonical ingredients:", len(CANONICAL_INGREDIENTS))
    print("Loaded unit map entries:", len(UNIT_MAP))
    print("Normalized ingredients example:", normalize_ingredients(["2 vine tomatoes", "1 tbsp olive oil"]))
    print("Aggregated shopping list:")
    print(json.dumps(shopping_list_from_recipes(sample_recipes), indent=2))
