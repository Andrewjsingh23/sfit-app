import { EXERCISES } from "../data/exercises";
import {
  Exercise,
  ExperienceLevel,
  Goal,
  UserProfile,
  WorkoutDay,
  WorkoutExerciseEntry,
  WorkoutLocation,
  WorkoutPlan
} from "../types";

/**
 * This is a deterministic, rule-based generator: it picks exercises from the
 * library based on goal/level/location and rotates through several "splits"
 * so that no two weeks look identical. It's intentionally simple to reason
 * about and debug.
 *
 * To go further with real "AI-generated workouts": keep this file's output
 * shape (WorkoutPlan) as your contract, and swap generateWorkoutPlan's body
 * for a call to your backend, which prompts an LLM (or a trained model) with
 * the user's profile + exercise library + past performance logs, and asks it
 * to return JSON matching this same shape. Validate the response against the
 * WorkoutPlan type before saving it.
 */

const GOAL_MUSCLE_FOCUS: Record<Goal, string[]> = {
  lose_weight: ["full_body", "cardio", "core"],
  gain_muscle: ["chest", "back", "quads", "glutes", "shoulders"],
  bulk: ["chest", "back", "quads", "hamstrings", "glutes", "shoulders"],
  glutes_legs: ["glutes", "quads", "hamstrings"],
  event_training: ["cardio", "full_body", "core", "legs"]
};

const GOAL_REST_MULTIPLIER: Record<Goal, number> = {
  lose_weight: 0.7, // shorter rest, keep heart rate up
  gain_muscle: 1.2,
  bulk: 1.4,
  glutes_legs: 1.0,
  event_training: 0.8
};

// Weekly split templates. We rotate through these so week 2 looks
// different from week 1 even at the same level/goal.
const SPLITS: Record<Goal, string[][]> = {
  lose_weight: [
    ["full_body", "cardio"],
    ["core", "cardio"],
    ["full_body", "core"],
    ["cardio", "full_body"]
  ],
  gain_muscle: [
    ["chest", "triceps", "shoulders"],
    ["back", "biceps"],
    ["quads", "glutes", "hamstrings"],
    ["full_body"]
  ],
  bulk: [
    ["chest", "shoulders"],
    ["back"],
    ["quads", "hamstrings", "glutes"],
    ["chest", "back", "shoulders"]
  ],
  glutes_legs: [
    ["glutes", "quads"],
    ["hamstrings", "glutes"],
    ["quads", "glutes", "core"],
    ["glutes"]
  ],
  event_training: [
    ["cardio", "legs"],
    ["core", "cardio"],
    ["full_body", "cardio"],
    ["legs", "cardio"]
  ]
};

const EXERCISES_PER_WORKOUT: Record<ExperienceLevel, number> = {
  beginner: 4,
  intermediate: 5,
  expert: 6
};

const REST_SECONDS_BY_LEVEL: Record<ExperienceLevel, number> = {
  beginner: 60,
  intermediate: 75,
  expert: 90
};

function pickExercisesForMuscles(
  muscles: string[],
  level: ExperienceLevel,
  location: WorkoutLocation,
  count: number,
  usedInWeek: Set<string>
): Exercise[] {
  const candidates = EXERCISES.filter(
    (e) =>
      e.location.includes(location) &&
      e.level.includes(level) &&
      e.muscleGroups.some((m) => muscles.includes(m))
  );

  // Prefer exercises not already used this week, to add variety.
  const fresh = candidates.filter((e) => !usedInWeek.has(e.id));
  const pool = fresh.length >= count ? fresh : candidates;

  // Simple deterministic "shuffle" seeded by exercise id so results are
  // stable across re-renders but still vary between muscle groups.
  const sorted = [...pool].sort((a, b) => a.id.localeCompare(b.id));
  return sorted.slice(0, count);
}

function buildWorkoutDay(
  dayIndex: number,
  weekIndex: number,
  goal: Goal,
  level: ExperienceLevel,
  location: WorkoutLocation,
  usedInWeek: Set<string>,
  isRest: boolean
): WorkoutDay {
  if (isRest) {
    return {
      id: `day-${dayIndex}`,
      dayIndex,
      weekIndex,
      title: "Rest & Mobility",
      isRestDay: true,
      estimatedMinutes: 10,
      exercises: [],
      completed: false
    };
  }

  const splitOptions = SPLITS[goal];
  const splitForDay = splitOptions[(dayIndex - 1) % splitOptions.length];
  const exerciseCount = EXERCISES_PER_WORKOUT[level];
  const restSeconds = Math.round(REST_SECONDS_BY_LEVEL[level] * GOAL_REST_MULTIPLIER[goal]);

  const chosen = pickExercisesForMuscles(splitForDay, level, location, exerciseCount, usedInWeek);
  chosen.forEach((e) => usedInWeek.add(e.id));

  const exercises: WorkoutExerciseEntry[] = chosen.map((e) => ({
    exerciseId: e.id,
    sets: e.defaultSets,
    reps: e.defaultReps,
    restSeconds
  }));

  const title = `${capitalize(splitForDay.join(" & "))} — Week ${weekIndex}`;
  const estimatedMinutes = 10 + exercises.length * 8; // rough estimate, tune with real testing

  return {
    id: `day-${dayIndex}`,
    dayIndex,
    weekIndex,
    title,
    isRestDay: false,
    estimatedMinutes,
    exercises,
    completed: false
  };
}

function capitalize(s: string): string {
  return s.replace(/(^|_| )(\w)/g, (m, sep, ch) => sep + ch.toUpperCase()).replace(/_/g, " ");
}

/**
 * Beginners get more rest days; experts train more frequently.
 * Returns true if `dayIndex` (1-based, within a 7-day week) is a rest day.
 */
function isRestDayForLevel(dayOfWeek: number, level: ExperienceLevel): boolean {
  if (level === "beginner") return dayOfWeek === 4 || dayOfWeek === 7; // 2 rest days/week
  if (level === "intermediate") return dayOfWeek === 7; // 1 rest day/week
  return dayOfWeek === 7 ? false : dayOfWeek === 4 && false; // experts: rest only every other week handled below
}

export function generateWorkoutPlan(profile: UserProfile): WorkoutPlan {
  const { goal, experienceLevel, location, planLengthDays } = profile;
  const days: WorkoutDay[] = [];

  for (let dayIndex = 1; dayIndex <= planLengthDays; dayIndex++) {
    const weekIndex = Math.ceil(dayIndex / 7);
    const dayOfWeek = ((dayIndex - 1) % 7) + 1;
    const usedInWeek = new Set<string>(); // reset variety-tracking per week start
    // Recompute usedInWeek by scanning back through this week's already-built days
    const weekStart = (weekIndex - 1) * 7 + 1;
    for (let d = weekStart; d < dayIndex; d++) {
      const prevDay = days[d - 1];
      prevDay?.exercises.forEach((ex) => usedInWeek.add(ex.exerciseId));
    }

    let rest: boolean;
    if (experienceLevel === "expert") {
      rest = dayOfWeek === 7 && weekIndex % 2 === 0; // experts rest 1 day every other week
    } else {
      rest = isRestDayForLevel(dayOfWeek, experienceLevel);
    }

    days.push(buildWorkoutDay(dayIndex, weekIndex, goal, experienceLevel, location, usedInWeek, rest));
  }

  return {
    id: `plan-${profile.id}-${Date.now()}`,
    userId: profile.id,
    goal,
    level: experienceLevel,
    location,
    lengthDays: planLengthDays,
    generatedAt: new Date().toISOString(),
    days
  };
}

/** Generates a single ~20 minute, equipment-optional calorie-burn workout for the "Quick Workout" feature. */
export function generateQuickWorkout(location: WorkoutLocation, level: ExperienceLevel): WorkoutExerciseEntry[] {
  const pool = EXERCISES.filter(
    (e) => e.location.includes(location) && e.level.includes(level) && e.muscleGroups.includes("cardio")
  );
  const fallback = EXERCISES.filter((e) => e.location.includes(location) && e.level.includes(level));
  const source = pool.length >= 4 ? pool : fallback;
  const chosen = [...source].sort((a, b) => a.id.localeCompare(b.id)).slice(0, 5);

  return chosen.map((e) => ({
    exerciseId: e.id,
    sets: 3,
    reps: e.defaultReps,
    restSeconds: 30 // short rest to keep a 20 min workout brisk
  }));
}
