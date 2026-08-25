import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { getExerciseById } from "../data/exercises";
import { WorkoutDay, WorkoutSetLog } from "../types";
import { colors, radius, spacing, typography } from "../theme";
import PrimaryButton from "../components/PrimaryButton";
import { useApp } from "../context/AppContext";

interface Props {
  day: WorkoutDay;
  onFinish: () => void;
  onExit: () => void;
}

/**
 * Single-screen "flow state" player: no navigation away from this screen
 * mid-workout (per the "no interruptions mid-workout" UX requirement).
 * Video demo + form cues shown for the active exercise; set logging is
 * a single tap to mark a set done, with quick +/- steppers for reps/weight.
 */
export default function WorkoutPlayerScreen({ day, onFinish, onExit }: Props) {
  const { markDayComplete } = useApp();
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [logs, setLogs] = useState<Record<string, WorkoutSetLog[]>>({});
  const [restSecondsLeft, setRestSecondsLeft] = useState<number | null>(null);

  const currentEntry = day.exercises[exerciseIndex];
  const exercise = currentEntry ? getExerciseById(currentEntry.exerciseId) : undefined;
  const currentLogs = currentEntry ? logs[currentEntry.exerciseId] ?? [] : [];

  useEffect(() => {
    if (restSecondsLeft === null) return;
    if (restSecondsLeft <= 0) {
      setRestSecondsLeft(null);
      return;
    }
    const t = setTimeout(() => setRestSecondsLeft((s) => (s ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [restSecondsLeft]);

  if (!currentEntry || !exercise) {
    return (
      <View style={styles.container}>
        <Text style={typography.h1}>Nice work!</Text>
        <PrimaryButton
          label="Finish workout"
          onPress={async () => {
            await markDayComplete(day.id);
            onFinish();
          }}
          style={{ marginTop: spacing(3) }}
        />
      </View>
    );
  }

  function logSet(reps: number, weightKg: number) {
    const newLog: WorkoutSetLog = { setNumber: currentLogs.length + 1, reps, weightKg, completed: true };
    setLogs((prev) => ({ ...prev, [currentEntry.exerciseId]: [...(prev[currentEntry.exerciseId] ?? []), newLog] }));

    if (currentLogs.length + 1 < currentEntry.sets) {
      setRestSecondsLeft(currentEntry.restSeconds);
    } else {
      // Move to next exercise automatically once all sets logged.
      setTimeout(() => setExerciseIndex((i) => i + 1), 400);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={onExit}>
          <Text style={styles.exitText}>✕</Text>
        </Pressable>
        <Text style={styles.progressText}>
          {exerciseIndex + 1} / {day.exercises.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: spacing(4) }}>
        <View style={styles.videoWrap}>
          {exercise.videoUrl ? (
            <Video
              source={{ uri: exercise.videoUrl }}
              resizeMode={ResizeMode.COVER}
              isLooping
              shouldPlay
              isMuted
              style={styles.video}
            />
          ) : (
            <View style={[styles.video, { alignItems: "center", justifyContent: "center" }]}>
              <Text style={{ color: colors.textMuted }}>No demo video yet</Text>
            </View>
          )}
        </View>

        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Text style={styles.setTarget}>
          Set {currentLogs.length + 1} of {currentEntry.sets} · Target: {currentEntry.reps}
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Form cues</Text>
          {exercise.formCues.map((cue, i) => (
            <Text key={i} style={styles.formCue}>
              • {cue}
            </Text>
          ))}
        </View>

        {restSecondsLeft !== null ? (
          <View style={styles.restCard}>
            <Text style={styles.restLabel}>Rest</Text>
            <Text style={styles.restTimer}>{restSecondsLeft}s</Text>
            <PrimaryButton label="Skip rest" onPress={() => setRestSecondsLeft(0)} variant="ghost" />
          </View>
        ) : (
          <SetLogger reps={currentEntry.reps} onLog={logSet} />
        )}
      </ScrollView>
    </View>
  );
}

function SetLogger({ reps, onLog }: { reps: string; onLog: (reps: number, weightKg: number) => void }) {
  const defaultReps = parseInt(reps) || 10;
  const [repCount, setRepCount] = useState(defaultReps);
  const [weight, setWeight] = useState(0);

  return (
    <View style={styles.logger}>
      <Stepper label="Reps" value={repCount} onChange={setRepCount} step={1} />
      <Stepper label="Weight (kg)" value={weight} onChange={setWeight} step={2.5} />
      <PrimaryButton label="Log set ✓" onPress={() => onLog(repCount, weight)} variant="accent" style={{ marginTop: spacing(2) }} />
    </View>
  );
}

function Stepper({ label, value, onChange, step }: { label: string; value: number; onChange: (v: number) => void; step: number }) {
  return (
    <View style={styles.stepperRow}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        <Pressable style={styles.stepperBtn} onPress={() => onChange(Math.max(0, value - step))}>
          <Text style={styles.stepperBtnText}>–</Text>
        </Pressable>
        <Text style={styles.stepperValue}>{value}</Text>
        <Pressable style={styles.stepperBtn} onPress={() => onChange(value + step)}>
          <Text style={styles.stepperBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: spacing(6), paddingHorizontal: spacing(3) },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing(2) },
  exitText: { color: colors.textMuted, fontSize: 20 },
  progressText: { color: colors.textMuted, fontWeight: "600" },
  videoWrap: { borderRadius: radius.lg, overflow: "hidden", backgroundColor: colors.surfaceAlt },
  video: { width: "100%", height: 220 },
  exerciseName: { ...typography.h1, marginTop: spacing(2) },
  setTarget: { ...typography.caption, marginTop: spacing(0.5) },
  formCard: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing(2), marginTop: spacing(3), borderWidth: 1, borderColor: colors.border },
  formTitle: { color: colors.primary, fontWeight: "700", marginBottom: spacing(1) },
  formCue: { color: colors.text, marginBottom: 4, fontSize: 14 },
  restCard: { alignItems: "center", marginTop: spacing(4), backgroundColor: colors.surfaceAlt, borderRadius: radius.lg, padding: spacing(4) },
  restLabel: { color: colors.textMuted, fontWeight: "600" },
  restTimer: { color: colors.primary, fontSize: 48, fontWeight: "800", marginVertical: spacing(1) },
  logger: { marginTop: spacing(3) },
  stepperRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing(1.5) },
  stepperLabel: { color: colors.text, fontSize: 15 },
  stepperControls: { flexDirection: "row", alignItems: "center", gap: spacing(1.5) },
  stepperBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  stepperBtnText: { color: colors.text, fontSize: 20, fontWeight: "700" },
  stepperValue: { color: colors.text, fontSize: 18, fontWeight: "700", minWidth: 40, textAlign: "center" }
});
