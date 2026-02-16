import { useNavigate } from "@tanstack/react-router";
import type { PropertySearchParams } from "@/lib/validations/property-search";

export function usePropertyFilters(currentSearch: PropertySearchParams) {
  const navigate = useNavigate();

  const setFilters = (updates: Partial<PropertySearchParams>) => {
    const merged = { ...currentSearch, ...updates };

    // Reset page to 1 when filters change (unless page is explicitly being set)
    if (!("page" in updates)) {
      delete merged.page;
    } else if (merged.page === 1) {
      delete merged.page;
    }

    // Remove undefined/empty values for clean URL
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(merged)) {
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) continue;
        cleaned[key] = value;
      }
    }

    navigate({
      to: "/properties",
      search: cleaned as PropertySearchParams,
    });
  };

  const resetFilters = () => {
    navigate({
      to: "/properties",
      search: {},
    });
  };

  return { filters: currentSearch, setFilters, resetFilters };
}
