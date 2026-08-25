import { StreakData } from "../types";

function isYesterday(dateIso: string): boolean {
  const d = new Date(dateIso);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toDateString() === yesterday.toDateString();
}

function isToday(dateIso: string): boolean {
  return new Date(dateIso).toDateString() === new Date().toDateString();
}

/** Call this whenever the user completes a workout for the day. */
export function recordCompletion(current: StreakData): StreakData {
  const todayIso = new Date().toISOString();

  if (current.lastCompletedDate && isToday(current.lastCompletedDate)) {
    // Already logged today, no change.
    return current;
  }

  const continuesStreak = current.lastCompletedDate ? isYesterday(current.lastCompletedDate) : false;
  const newStreak = continuesStreak ? current.currentStreak + 1 : 1;

  return {
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, current.longestStreak),
    lastCompletedDate: todayIso
  };
}

/** Call on app open to check if a streak was broken (no workout yesterday or today). */
export function checkStreakBroken(current: StreakData): StreakData {
  if (!current.lastCompletedDate) return current;
  const lastWasTodayOrYesterday = isToday(current.lastCompletedDate) || isYesterday(current.lastCompletedDate);
  if (lastWasTodayOrYesterday) return current;
  return { ...current, currentStreak: 0 };
}

export const EMPTY_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null
};
