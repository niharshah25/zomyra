import { create } from "zustand";
import { defaultOnboardingState, type OnboardingState } from "@/src/lib/onboarding/types";

type OnboardingStore = {
  state: OnboardingState;
  set: <K extends keyof OnboardingState>(k: K, v: OnboardingState[K]) => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  state: defaultOnboardingState,
  set: (k, v) => set((s) => ({ state: { ...s.state, [k]: v } })),
  reset: () => set({ state: defaultOnboardingState }),
}));
