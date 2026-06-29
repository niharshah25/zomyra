/**
 * Discover filter state — only stores user selections.
 * Filtering / ranking still happens in Discover (compatibility dimension).
 */
import { create } from "zustand";

export type FilterKey = "age" | "religion" | "diet" | "location";

type FilterState = {
  age: string | null;        // e.g. "26 – 30"
  religion: string | null;   // e.g. "Hindu"
  diet: string | null;       // e.g. "Vegetarian"
  location: string | null;   // e.g. "Bangalore"
  set: (key: FilterKey, value: string | null) => void;
  reset: () => void;
};

export const useDiscoverFilters = create<FilterState>((set) => ({
  age: null,
  religion: null,
  diet: null,
  location: null,
  set: (key, value) => set({ [key]: value } as Partial<FilterState>),
  reset: () => set({ age: null, religion: null, diet: null, location: null }),
}));

// Option lists used by the bottom sheets and Filters screen.
export const FILTER_OPTIONS: Record<FilterKey, string[]> = {
  age: ["22 – 25", "26 – 30", "31 – 35", "36 – 40", "41 +"],
  religion: ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Parsi", "Other"],
  diet: ["Vegetarian", "Eggetarian", "Non-Vegetarian", "Vegan", "Jain"],
  location: [
    "Bangalore",
    "Mumbai",
    "Delhi NCR",
    "Pune",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Ahmedabad",
  ],
};

export const FILTER_LABEL: Record<FilterKey, string> = {
  age: "Age",
  religion: "Religion",
  diet: "Diet",
  location: "Location",
};
