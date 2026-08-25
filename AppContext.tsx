import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { DietPlan, StreakData, UnlockState, UserProfile, WorkoutPlan } from "../types";
import { KEYS, loadJson, saveJson } from "../utils/storage";
import { EMPTY_STREAK, checkStreakBroken, recordCompletion } from "../utils/streak";
import { generateWorkoutPlan } from "../utils/workoutGenerator";
import { generateDietPlan } from "../utils/dietGenerator";

interface AppContextValue {
  loading: boolean;
  profile: UserProfile | null;
  workoutPlan: WorkoutPlan | null;
  dietPlan: DietPlan | null;
  streak: StreakData;
  unlocks: UnlockState;
  setProfileAndGeneratePlans: (profile: UserProfile) => Promise<void>;
  markDayComplete: (dayId: string, logs?: Record<string, unknown>) => Promise<void>;
  unlockExtraWorkouts: (count: number) => Promise<void>;
  unlockExtraMealDays: (count: number) => Promise<void>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const EMPTY_UNLOCKS: UnlockState = { extraWorkoutsUnlocked: 0, extraMealDaysUnlocked: 0 };

export function AppProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [streak, setStreak] = useState<StreakData>(EMPTY_STREAK);
  const [unlocks, setUnlocks] = useState<UnlockState>(EMPTY_UNLOCKS);

  useEffect(() => {
    (async () => {
      const [p, w, d, s, u] = await Promise.all([
        loadJson<UserProfile>(KEYS.profile),
        loadJson<WorkoutPlan>(KEYS.workoutPlan),
        loadJson<DietPlan>(KEYS.dietPlan),
        loadJson<StreakData>(KEYS.streak),
        loadJson<UnlockState>(KEYS.unlocks)
      ]);
      setProfile(p);
      setWorkoutPlan(w);
      setDietPlan(d);
      setStreak(s ? checkStreakBroken(s) : EMPTY_STREAK);
      setUnlocks(u ?? EMPTY_UNLOCKS);
      setLoading(false);
    })();
  }, []);

  async function setProfileAndGeneratePlans(newProfile: UserProfile) {
    const plan = generateWorkoutPlan(newProfile);
    const diet = newProfile.wantsDietPlan ? generateDietPlan(newProfile) : null;

    setProfile(newProfile);
    setWorkoutPlan(plan);
    setDietPlan(diet);

    await saveJson(KEYS.profile, newProfile);
    await saveJson(KEYS.workoutPlan, plan);
    if (diet) await saveJson(KEYS.dietPlan, diet);
  }

  async function markDayComplete(dayId: string) {
    if (!workoutPlan) return;
    const updatedDays = workoutPlan.days.map((d) => (d.id === dayId ? { ...d, completed: true, completedAt: new Date().toISOString() } : d));
    const updatedPlan = { ...workoutPlan, days: updatedDays };
    setWorkoutPlan(updatedPlan);
    await saveJson(KEYS.workoutPlan, updatedPlan);

    const newStreak = recordCompletion(streak);
    setStreak(newStreak);
    await saveJson(KEYS.streak, newStreak);
  }

  async function unlockExtraWorkouts(count: number) {
    const updated = { ...unlocks, extraWorkoutsUnlocked: unlocks.extraWorkoutsUnlocked + count };
    setUnlocks(updated);
    await saveJson(KEYS.unlocks, updated);
  }

  async function unlockExtraMealDays(count: number) {
    const updated = { ...unlocks, extraMealDaysUnlocked: unlocks.extraMealDaysUnlocked + count };
    setUnlocks(updated);
    await saveJson(KEYS.unlocks, updated);
  }

  async function signOut() {
    setProfile(null);
    setWorkoutPlan(null);
    setDietPlan(null);
    setStreak(EMPTY_STREAK);
    setUnlocks(EMPTY_UNLOCKS);
    // Intentionally not clearing storage here in the scaffold so returning
    // users could "sign back in" without redoing onboarding; wire real
    // sign-out/account deletion behavior once auth is real.
  }

  return (
    <AppContext.Provider
      value={{
        loading,
        profile,
        workoutPlan,
        dietPlan,
        streak,
        unlocks,
        setProfileAndGeneratePlans,
        markDayComplete,
        unlockExtraWorkouts,
        unlockExtraMealDays,
        signOut
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
