import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useApp } from "../context/AppContext";
import { colors, radius, spacing, typography } from "../theme";

export default function ProgressScreen() {
  const { workoutPlan, streak } = useApp();

  const completedCount = workoutPlan?.days.filter((d) => d.completed).length ?? 0;
  const totalCount = workoutPlan?.days.filter((d) => !d.isRestDay).length ?? 0;
  const pct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing(3), paddingTop: spacing(7), paddingBottom: spacing(6) }}>
      <Text style={typography.h1}>Progress</Text>

      <View style={styles.statsRow}>
        <StatCard label="Current streak" value={`${streak.currentStreak}d`} />
        <StatCard label="Longest streak" value={`${streak.longestStreak}d`} />
        <StatCard label="Plan complete" value={`${pct}%`} />
      </View>

      <Text style={[typography.h2, { marginTop: spacing(4), marginBottom: spacing(1.5) }]}>Workout log</Text>
      {workoutPlan?.days
        .filter((d) => d.completed)
        .map((d) => (
          <View key={d.id} style={styles.logRow}>
            <Text style={styles.logTitle}>{d.title}</Text>
            <Text style={styles.logDate}>{d.completedAt ? new Date(d.completedAt).toLocaleDateString() : ""}</Text>
          </View>
        ))}
      {completedCount === 0 && <Text style={typography.caption}>Complete your first workout to start building history here.</Text>}

      {/*
        Weight/body-metric trend charting: wire this up with `victory-native`
        once you're logging periodic weight check-ins (e.g. weekly prompt).
        Example:
        <VictoryChart>
          <VictoryLine data={weightEntries} x="date" y="weightKg" />
        </VictoryChart>
      */}
    </ScrollView>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  statsRow: { flexDirection: "row", gap: spacing(1.5), marginTop: spacing(3) },
  statCard: { flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: spacing(2), alignItems: "center", borderWidth: 1, borderColor: colors.border },
  statValue: { color: colors.primary, fontSize: 22, fontWeight: "800" },
  statLabel: { color: colors.textMuted, fontSize: 12, marginTop: 4, textAlign: "center" },
  logRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing(1.25), borderBottomWidth: 1, borderBottomColor: colors.border },
  logTitle: { color: colors.text },
  logDate: { color: colors.textMuted, fontSize: 12 }
});
