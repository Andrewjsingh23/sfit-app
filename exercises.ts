import { Exercise } from "../types";

// Starter library. In production, pull this from a CMS (e.g. Sanity/Contentful)
// or your own backend so you can update videos/cues without shipping an app update.
// videoUrl points at where your hosted (e.g. Mux/Cloudflare Stream/S3+CDN) clips would live.

export const EXERCISES: Exercise[] = [
  {
    id: "bodyweight_squat",
    name: "Bodyweight Squat",
    muscleGroups: ["quads", "glutes", "hamstrings"],
    equipment: "none",
    location: ["home", "gym"],
    level: ["beginner", "intermediate", "expert"],
    videoUrl: "https://cdn.example.com/videos/bodyweight_squat.mp4",
    thumbnailUrl: "https://cdn.example.com/thumbs/bodyweight_squat.jpg",
    formCues: [
      "Feet shoulder-width, toes slightly out",
      "Push hips back first, chest stays tall",
      "Knees track over toes, don't cave in",
      "Drive through the whole foot to stand"
    ],
    defaultSets: 3,
    defaultReps: "15-20"
  },
  {
    id: "goblet_squat",
    name: "Goblet Squat",
    muscleGroups: ["quads", "glutes"],
    equipment: "dumbbell",
    location: ["home", "gym"],
    level: ["beginner", "intermediate", "expert"],
    videoUrl: "https://cdn.example.com/videos/goblet_squat.mp4",
    formCues: [
      "Hold the weight close to your chest",
      "Elbows brush the inside of your knees at the bottom",
      "Keep your back flat, not rounded"
    ],
    defaultSets: 4,
    defaultReps: "10-12"
  },
  {
    id: "hip_thrust",
    name: "Hip Thrust",
    muscleGroups: ["glutes", "hamstrings"],
    equipment: "barbell",
    location: ["gym"],
    level: ["beginner", "intermediate", "expert"],
    videoUrl: "https://cdn.example.com/videos/hip_thrust.mp4",
    formCues: [
      "Shoulder blades on the bench, chin tucked",
      "Drive through your heels, squeeze glutes at the top",
      "Avoid overextending your lower back"
    ],
    defaultSets: 4,
    defaultReps: "10-15"
  },
  {
    id: "glute_bridge",
    name: "Glute Bridge",
    muscleGroups: ["glutes", "hamstrings"],
    equipment: "none",
    location: ["home", "gym"],
    level: ["beginner", "intermediate", "expert"],
    videoUrl: "https://cdn.example.com/videos/glute_bridge.mp4",
    formCues: ["Squeeze glutes hard at the top for 1 second", "Don't let knees splay outward"],
    defaultSets: 3,
    defaultReps: "15-20"
  },
  {
    id: "pushup",
    name: "Push-Up",
    muscleGroups: ["chest", "triceps", "shoulders"],
    equipment: "none",
    location: ["home", "gym"],
    level: ["beginner", "intermediate", "expert"],
    videoUrl: "https://cdn.example.com/videos/pushup.mp4",
    formCues: [
      "Body forms a straight line head to heels",
      "Lower until chest nearly touches the floor",
      "Elbows at ~45°, not flared to 90°"
    ],
    defaultSets: 3,
    defaultReps: "8-15"
  },
  {
    id: "dumbbell_bench_press",
    name: "Dumbbell Bench Press",
    muscleGroups: ["chest", "triceps", "shoulders"],
    equipment: "dumbbell",
    location: ["gym", "home"],
    level: ["intermediate", "expert"],
    videoUrl: "https://cdn.example.com/videos/db_bench_press.mp4",
    formCues: ["Feet flat on the floor for stability", "Lower with control, don't bounce off your chest"],
    defaultSets: 4,
    defaultReps: "8-10"
  },
  {
    id: "barbell_deadlift",
    name: "Barbell Deadlift",
    muscleGroups: ["hamstrings", "glutes", "back"],
    equipment: "barbell",
    location: ["gym"],
    level: ["intermediate", "expert"],
    videoUrl: "https://cdn.example.com/videos/deadlift.mp4",
    formCues: [
      "Bar stays close to your shins the whole rep",
      "Flat back, brace your core before you pull",
      "Push the floor away rather than yanking the bar"
    ],
    defaultSets: 4,
    defaultReps: "5-8"
  },
  {
    id: "kettlebell_swing",
    name: "Kettlebell Swing",
    muscleGroups: ["glutes", "hamstrings", "core"],
    equipment: "kettlebell",
    location: ["home", "gym"],
    level: ["intermediate", "expert"],
    videoUrl: "https://cdn.example.com/videos/kb_swing.mp4",
    formCues: ["This is a hip hinge, not a squat", "Power comes from snapping the hips forward"],
    defaultSets: 4,
    defaultReps: "15-20"
  },
  {
    id: "plank",
    name: "Plank",
    muscleGroups: ["core"],
    equipment: "none",
    location: ["home", "gym"],
    level: ["beginner", "intermediate", "expert"],
    videoUrl: "https://cdn.example.com/videos/plank.mp4",
    formCues: ["Ribs pulled down, don't let hips sag", "Squeeze glutes and quads to stay rigid"],
    defaultSets: 3,
    defaultReps: "30-45 sec"
  },
  {
    id: "mountain_climbers",
    name: "Mountain Climbers",
    muscleGroups: ["core", "cardio"],
    equipment: "none",
    location: ["home", "gym"],
    level: ["beginner", "intermediate", "expert"],
    videoUrl: "https://cdn.example.com/videos/mountain_climbers.mp4",
    formCues: ["Keep hips low and level", "Drive knees toward your chest, not out to the side"],
    defaultSets: 3,
    defaultReps: "30 sec"
  },
  {
    id: "burpees",
    name: "Burpees",
    muscleGroups: ["full_body", "cardio"],
    equipment: "none",
    location: ["home", "gym"],
    level: ["intermediate", "expert"],
    videoUrl: "https://cdn.example.com/videos/burpees.mp4",
    formCues: ["Chest touches the floor on the way down", "Land softly on the jump, knees slightly bent"],
    defaultSets: 4,
    defaultReps: "10-15"
  },
  {
    id: "lat_pulldown",
    name: "Lat Pulldown",
    muscleGroups: ["back", "biceps"],
    equipment: "machine",
    location: ["gym"],
    level: ["beginner", "intermediate", "expert"],
    videoUrl: "https://cdn.example.com/videos/lat_pulldown.mp4",
    formCues: ["Pull to your upper chest, not behind your neck", "Lead with your elbows, not your hands"],
    defaultSets: 4,
    defaultReps: "10-12"
  },
  {
    id: "walking_lunge",
    name: "Walking Lunge",
    muscleGroups: ["quads", "glutes"],
    equipment: "none",
    location: ["home", "gym"],
    level: ["beginner", "intermediate", "expert"],
    videoUrl: "https://cdn.example.com/videos/walking_lunge.mp4",
    formCues: ["Front knee stays over the ankle", "Torso stays upright, don't lean forward"],
    defaultSets: 3,
    defaultReps: "12 per leg"
  },
  {
    id: "row_erg",
    name: "Rowing Machine Intervals",
    muscleGroups: ["back", "cardio", "legs"],
    equipment: "machine",
    location: ["gym"],
    level: ["intermediate", "expert"],
    videoUrl: "https://cdn.example.com/videos/rowing.mp4",
    formCues: ["Legs-hips-arms on the drive, reverse on the recovery", "Keep a tall posture, don't round your back"],
    defaultSets: 6,
    defaultReps: "250m"
  },
  {
    id: "farmers_carry",
    name: "Farmer's Carry",
    muscleGroups: ["grip", "core", "full_body"],
    equipment: "dumbbell",
    location: ["home", "gym"],
    level: ["beginner", "intermediate", "expert"],
    videoUrl: "https://cdn.example.com/videos/farmers_carry.mp4",
    formCues: ["Shoulders back and down, don't shrug", "Walk with short, controlled steps"],
    defaultSets: 3,
    defaultReps: "40m"
  }
];

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}
