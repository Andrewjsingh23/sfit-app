import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useApp } from "../context/AppContext";
import PrimaryButton from "../components/PrimaryButton";
import StreakBadge from "../components/StreakBadge";
import { colors, radius, spacing, typography } from "../theme";
import { WorkoutDay } from "../types";

interface Props {
  onStartWorkout: (day: WorkoutDay) => void;
  onStartQuickWorkout: () => void;
  onOpenPlan: () => void;
}

function getTimeAwareGreeting(name: string): string {
  const hour = new Date().getHours();
  const period = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  return `Good ${period}, ${name.split(" ")[0] || "there"}`;
}

export default function HomeScreen({ onStartWorkout, onStartQuickWorkout, onOpenPlan }: Props) {
  const { profile, workoutPlan, streak } = useApp();

  const todayDay = useMemo(() => {
    if (!workoutPlan) return null;
    // Determine which plan day corresponds to "today" based on the first
    // incomplete day — keeps the plan flowing even if the user misses a day,
    // rather than hard-locking to calendar dates (a common source of
    // friction/guilt in fitness apps).
    return workoutPlan.days.find((d) => !d.completed) ?? workoutPlan.days[workoutPlan.days.length - 1];
  }, [workoutPlan]);

  if (!profile) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing(3), paddingTop: spacing(7), paddingBottom: spacing(6) }}>
      <View style={styles.headerRow}>
        <Text style={typography.h1}>{getTimeAwareGreeting(profile.name)}</Text>
        <StreakBadge days={streak.currentStreak} />
      </View>

      {todayDay && !todayDay.isRestDay && (
        <Pressable style={styles.todayCard} onPress={() => onStartWorkout(todayDay)}>
          <Text style={styles.todayLabel}>TODAY — WEEK {todayDay.weekIndex}</Text>
          <Text style={styles.todayTitle}>{todayDay.title}</Text>
          <Text style={styles.todayMeta}>
            {todayDay.exercises.length} exercises · ~{todayDay.estimatedMinutes} min
          </Text>
          <PrimaryButton label="Start workout in 1 tap" onPress={() => onStartWorkout(todayDay)} style={{ marginTop: spacing(2) }} />
        </Pressable>
      )}

      {todayDay && todayDay.isRestDay && (
        <View style={styles.todayCard}>
          <Text style={styles.todayLabel}>TODAY — WEEK {todayDay.weekIndex}</Text>
          <Text style={styles.todayTitle}>Rest & Mobility</Text>
          <Text style={styles.todayMeta}>Recovery matters as much as training. Stretch, hydrate, sleep well.</Text>
        </View>
      )}

      <Text style={[typography.h2, { marginTop: spacing(4), marginBottom: spacing(1.5) }]}>Short on time?</Text>
      <Pressable style={styles.quickCard} onPress={onStartQuickWorkout}>
        <View>
          <Text style={styles.quickTitle}>Quick Workout</Text>
          <Text style={styles.quickSubtitle}>~20 min · calorie burn · no planning needed</Text>
        </View>
        <Text style={styles.quickArrow}>→</Text>
      </Pressable>

      <Text style={[typography.h2, { marginTop: spacing(4), marginBottom: spacing(1.5) }]}>Micro-workouts</Text>
      <View style={{ flexDirection: "row", gap: spacing(1.5) }}>
        {[5, 10].map((min) => (
          <Pressable key={min} style={styles.microCard} onPress={onStartQuickWorkout}>
            <Text style={styles.microMinutes}>{min} min</Text>
            <Text style={styles.microLabel}>Energy boost</Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={onOpenPlan} style={{ marginTop: spacing(4) }}>
        <Text style={{ color: colors.primary, fontWeight: "700", textAlign: "center" }}>View full {workoutPlan?.lengthDays}-day plan →</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: spacing(1) },
  todayCard: {
    marginTop: spacing(3),
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing(3),
    borderWidth: 1,
    borderColor: colors.border
  },
  todayLabel: { color: colors.primary, fontWeight: "700", fontSize: 12, letterSpacing: 1 },
  todayTitle: { color: colors.text, fontSize: 22, fontWeight: "700", marginTop: spacing(0.5) },
  todayMeta: { color: colors.textMuted, marginTop: spacing(0.5) },
  quickCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing(2.5),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border
  },
  quickTitle: { color: colors.text, fontWeight: "700", fontSize: 16 },
  quickSubtitle: { color: colors.textMuted, marginTop: 2, fontSize: 13 },
  quickArrow: { color: colors.primary, fontSize: 20, fontWeight: "700" },
  microCard: { flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: spacing(2), borderWidth: 1, borderColor: colors.border },
  microMinutes: { color: colors.primary, fontSize: 22, fontWeight: "800" },
  microLabel: { color: colors.textMuted, marginTop: 2 }
});
