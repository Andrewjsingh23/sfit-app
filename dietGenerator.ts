import { DietDay, DietPlan, Goal, MealEntry, UserProfile } from "../types";

/** Mifflin-St Jeor estimate, then adjust by goal. This is a starting estimate,
 * not medical advice — say so in the UI and let users edit their target. */
function estimateCalorieTarget(profile: UserProfile): number {
  const age = getAge(profile.birthday);
  const { weightKg, heightCm, sex, goal } = profile;

  const bmr =
    sex === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const activityMultiplier = 1.4; // conservative "lightly active" default, adjustable in Settings
  const maintenance = bmr * activityMultiplier;

  const goalAdjustment: Record<Goal, number> = {
    lose_weight: -500,
    gain_muscle: 250,
    bulk: 500,
    glutes_legs: 200,
    event_training: 100
  };

  return Math.round(maintenance + goalAdjustment[goal]);
}

function getAge(birthdayIso: string): number {
  const birth = new Date(birthdayIso);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    now.getMonth() > birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

// Simple rotating meal templates by goal. Replace with a real nutrition
// database/API (e.g. Edamam, Spoonacular) for production-grade variety.
const MEAL_TEMPLATES: Record<Goal, MealEntry[][]> = {
  lose_weight: [
    [
      { name: "Greek yogurt, berries, chia", calories: 320, proteinG: 28, carbsG: 32, fatG: 8 },
      { name: "Grilled chicken salad, olive oil dressing", calories: 480, proteinG: 40, carbsG: 25, fatG: 22 },
      { name: "Baked salmon, steamed broccoli, quinoa", calories: 520, proteinG: 38, carbsG: 40, fatG: 20 },
      { name: "Apple + almond butter", calories: 200, proteinG: 5, carbsG: 22, fatG: 11 }
    ]
  ],
  gain_muscle: [
    [
      { name: "Oats, whey protein, banana, peanut butter", calories: 560, proteinG: 40, carbsG: 60, fatG: 16 },
      { name: "Turkey & rice bowl, avocado", calories: 650, proteinG: 45, carbsG: 65, fatG: 20 },
      { name: "Lean beef, sweet potato, greens", calories: 700, proteinG: 48, carbsG: 55, fatG: 25 },
      { name: "Cottage cheese, granola", calories: 350, proteinG: 24, carbsG: 30, fatG: 12 }
    ]
  ],
  bulk: [
    [
      { name: "Whole eggs, oats, whole milk", calories: 700, proteinG: 35, carbsG: 70, fatG: 25 },
      { name: "Beef, pasta, olive oil", calories: 800, proteinG: 45, carbsG: 80, fatG: 28 },
      { name: "Salmon, rice, mixed veg", calories: 750, proteinG: 42, carbsG: 65, fatG: 30 },
      { name: "Protein shake, mixed nuts, dried fruit", calories: 450, proteinG: 30, carbsG: 40, fatG: 18 }
    ]
  ],
  glutes_legs: [
    [
      { name: "Egg white omelet, sweet potato hash", calories: 450, proteinG: 32, carbsG: 45, fatG: 12 },
      { name: "Grilled chicken thigh, rice, roasted veg", calories: 600, proteinG: 42, carbsG: 55, fatG: 18 },
      { name: "Lean beef stir fry, brown rice", calories: 620, proteinG: 40, carbsG: 58, fatG: 20 },
      { name: "Protein smoothie, oats", calories: 300, proteinG: 24, carbsG: 35, fatG: 6 }
    ]
  ],
  event_training: [
    [
      { name: "Oats, banana, honey", calories: 500, proteinG: 18, carbsG: 85, fatG: 10 },
      { name: "Chicken, pasta, tomato sauce", calories: 650, proteinG: 40, carbsG: 75, fatG: 15 },
      { name: "Fish, rice, roasted vegetables", calories: 600, proteinG: 38, carbsG: 60, fatG: 16 },
      { name: "Electrolyte smoothie, dates", calories: 280, proteinG: 8, carbsG: 55, fatG: 4 }
    ]
  ]
};

export function generateDietPlan(profile: UserProfile): DietPlan {
  const targetCalories = estimateCalorieTarget(profile);
  const templates = MEAL_TEMPLATES[profile.goal];

  const days: DietDay[] = Array.from({ length: 60 }, (_, i) => {
    const dayIndex = i + 1;
    const meals = templates[i % templates.length];
    return {
      dayIndex,
      targetCalories,
      meals,
      // First 14 days fully open; after that days progressively unlock via
      // streak or rewarded ads (see UnlockState + AdUnlockModal).
      locked: dayIndex > 14
    };
  });

  return {
    id: `diet-${profile.id}-${Date.now()}`,
    userId: profile.id,
    lengthDays: 60,
    days
  };
}
