import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  profile: "@fitforge/profile",
  workoutPlan: "@fitforge/workout_plan",
  dietPlan: "@fitforge/diet_plan",
  streak: "@fitforge/streak",
  unlocks: "@fitforge/unlocks"
} as const;

export async function saveJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function loadJson<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}

export { KEYS };

// NOTE: AsyncStorage is local-only. For real launch you'll want this synced
// to a backend (Firebase/Supabase) so users don't lose data on reinstall and
// so plans can sync across devices. Keep these function signatures stable
// and swap the implementation to API calls when you add that.
