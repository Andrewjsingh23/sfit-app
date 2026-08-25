import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, SectionList, Pressable } from "react-native";
import { useApp } from "../context/AppContext";
import { WorkoutDay } from "../types";
import { colors, radius, spacing, typography } from "../theme";
import AdUnlockModal from "../components/AdUnlockModal";

interface Props {
  onSelectDay: (day: WorkoutDay) => void;
}

const FREE_DAYS_BEFORE_LOCK = 14; // first 2 weeks fully open, matches the diet plan unlock window
const DAYS_PER_AD_UNLOCK = 3;

export default function WorkoutPlanScreen({ onSelectDay }: Props) {
  const { workoutPlan, unlocks, unlockExtraWorkouts } = useApp();
  const [adModalVisible, setAdModalVisible] = useState(false);

  const sections = useMemo(() => {
    if (!workoutPlan) return [];
    const byWeek = new Map<number, WorkoutDay[]>();
    workoutPlan.days.forEach((d) => {
      const arr = byWeek.get(d.weekIndex) ?? [];
      arr.push(d);
      byWeek.set(d.weekIndex, arr);
    });
    return Array.from(byWeek.entries()).map(([week, days]) => ({ title: `Week ${week}`, data: days }));
  }, [workoutPlan]);

  const totalFreeDays = FREE_DAYS_BEFORE_LOCK + unlocks.extraWorkoutsUnlocked;

  if (!workoutPlan) return null;

  function isLocked(day: WorkoutDay) {
    return day.dayIndex > totalFreeDays;
  }

  return (
    <View style={styles.container}>
      <SectionList
        contentContainerStyle={{ padding: spacing(3), paddingTop: spacing(7), paddingBottom: spacing(6) }}
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => <Text style={styles.weekHeader}>{section.title}</Text>}
        renderItem={({ item }) => {
          const locked = isLocked(item);
          return (
            <Pressable
              style={[styles.dayRow, item.completed && styles.dayRowCompleted]}
              onPress={() => (locked ? setAdModalVisible(true) : onSelectDay(item))}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.dayTitle}>
                  Day {item.dayIndex} · {item.title}
                </Text>
                {!item.isRestDay && <Text style={styles.dayMeta}>{item.exercises.length} exercises · ~{item.estimatedMinutes} min</Text>}
              </View>
              {locked && <Text style={styles.lockIcon}>🔒</Text>}
              {!locked && item.completed && <Text style={styles.checkIcon}>✓</Text>}
            </Pressable>
          );
        }}
      />

      <AdUnlockModal
        visible={adModalVisible}
        title="Unlock 3 more workouts"
        description="Watch a short ad to unlock the next 3 workout days. FitForge stays free — ads are how we keep it that way."
        onClose={() => setAdModalVisible(false)}
        onRewardEarned={() => unlockExtraWorkouts(DAYS_PER_AD_UNLOCK)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  weekHeader: { ...typography.h2, backgroundColor: colors.bg, paddingVertical: spacing(1.5) },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing(2),
    marginBottom: spacing(1),
    borderWidth: 1,
    borderColor: colors.border
  },
  dayRowCompleted: { opacity: 0.6 },
  dayTitle: { color: colors.text, fontWeight: "600" },
  dayMeta: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  lockIcon: { fontSize: 18 },
  checkIcon: { color: colors.primary, fontSize: 18, fontWeight: "800" }
});
