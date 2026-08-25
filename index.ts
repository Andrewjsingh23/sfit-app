// ---------- User & onboarding ----------

export type Sex = "male" | "female" | "unspecified";

export type Goal =
  | "lose_weight"
  | "gain_muscle"
  | "bulk"
  | "glutes_legs"
  | "event_training";

export type EventType = "hyrox" | "marathon" | "half_marathon" | "triathlon" | "obstacle_race" | "other";

export type ExperienceLevel = "beginner" | "intermediate" | "expert";

export type WorkoutLocation = "home" | "gym";

export interface UserProfile {
  id: string;
  authProvider: "google" | "apple" | "facebook" | "email";
  email: string;
  name: string;
  birthday: string; // ISO date
  heightCm: number;
  weightKg: number;
  sex: Sex;
  goal: Goal;
  eventType?: EventType;
  eventDate?: string; // ISO date, for event_training goal
  experienceLevel: ExperienceLevel;
  location: WorkoutLocation;
  planLengthDays: 30 | 45 | 60;
  wantsDietPlan: boolean;
  createdAt: string;
}

// ---------- Exercises ----------

export interface Exercise {
  id: string;
  name: string;
  muscleGroups: string[];
  equipment: "none" | "dumbbell" | "barbell" | "kettlebell" | "band" | "machine" | "bench";
  location: WorkoutLocation[]; // where it can be performed
  level: ExperienceLevel[]; // which levels it's appropriate for
  videoUrl?: string; // short looping demo clip
  thumbnailUrl?: string;
  formCues: string[]; // bullet-point form reminders shown during the set
  defaultSets: number;
  defaultReps: string; // e.g. "10-12" or "30 sec"
}

// ---------- Workout plan ----------

export interface WorkoutSetLog {
  setNumber: number;
  reps: number;
  weightKg: number;
  completed: boolean;
}

export interface WorkoutExerciseEntry {
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds: number;
  logs?: WorkoutSetLog[];
}

export interface WorkoutDay {
  id: string;
  dayIndex: number; // 1..planLengthDays
  weekIndex: number; // 1-based week number, used to vary week-over-week
  title: string; // e.g. "Push Day A" or "Rest & Mobility"
  isRestDay: boolean;
  estimatedMinutes: number;
  exercises: WorkoutExerciseEntry[];
  completed: boolean;
  completedAt?: string;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  goal: Goal;
  level: ExperienceLevel;
  location: WorkoutLocation;
  lengthDays: number;
  generatedAt: string;
  days: WorkoutDay[];
}

// ---------- Diet ----------

export interface MealEntry {
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  notes?: string;
}

export interface DietDay {
  dayIndex: number;
  targetCalories: number;
  meals: MealEntry[]; // breakfast, lunch, dinner, snack
  locked: boolean; // unlocked progressively / via ad, see monetization
}

export interface DietPlan {
  id: string;
  userId: string;
  lengthDays: 60;
  days: DietDay[];
}

// ---------- Progress ----------

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null; // ISO date
}

export interface UnlockState {
  extraWorkoutsUnlocked: number; // via rewarded ads
  extraMealDaysUnlocked: number;
}
