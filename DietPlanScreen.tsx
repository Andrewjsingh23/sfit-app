import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useApp } from "../context/AppContext";
import { colors, radius, spacing, typography } from "../theme";
import AdUnlockModal from "../components/AdUnlockModal";

const FREE_DAYS_BEFORE_LOCK = 14;
const DAYS_PER_AD_UNLOCK = 3;

export default function DietPlanScreen() {
  const { dietPlan, unlocks, unlockExtraMealDays } = useApp();
  const [adModalVisible, setAdModalVisible] = useState(false);
  const [pendingDay, setPendingDay] = useState<number | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  if (!dietPlan) {
    return (
      <View style={styles.container}>
        <Text style={[typography.h2, { padding: spacing(3), paddingTop: spacing(8) }]}>
          No meal plan yet — you can add one from Settings.
        </Text>
      </View>
    );
  }

  const totalFreeDays = FREE_DAYS_BEFORE_LOCK + unlocks.extraMealDaysUnlocked;

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{ padding: spacing(3), paddingTop: spacing(7), paddingBottom: spacing(6) }}
        data={dietPlan.days}
        keyExtractor={(item) => String(item.dayIndex)}
        renderItem={({ item }) => {
          const locked = item.dayIndex > totalFreeDays;
          const expanded = expandedDay === item.dayIndex;
          return (
            <Pressable
              style={styles.dayCard}
              onPress={() => {
                if (locked) {
                  setPendingDay(item.dayIndex);
                  setAdModalVisible(true);
                } else {
                  setExpandedDay(expanded ? null : item.dayIndex);
                }
              }}
            >
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>
                  Day {item.dayIndex} · {item.targetCalories} kcal
                </Text>
                {locked && <Text>🔒</Text>}
              </View>
              {!locked && expanded && (
                <View style={{ marginTop: spacing(1.5) }}>
                  {item.meals.map((m, i) => (
                    <View key={i} style={styles.mealRow}>
                      <Text style={styles.mealName}>{m.name}</Text>
                      <Text style={styles.mealMacros}>
                        {m.calories} kcal · P{m.proteinG} C{m.carbsG} F{m.fatG}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </Pressable>
          );
        }}
      />

      <AdUnlockModal
        visible={adModalVisible}
        title="Unlock 3 more meal days"
        description="Watch a short ad to unlock the next 3 days of your meal plan."
        onClose={() => setAdModalVisible(false)}
        onRewardEarned={() => {
          unlockExtraMealDays(DAYS_PER_AD_UNLOCK);
          setPendingDay(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  dayCard: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing(2), marginBottom: spacing(1), borderWidth: 1, borderColor: colors.border },
  dayHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dayTitle: { color: colors.text, fontWeight: "600" },
  mealRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing(0.75), borderTopWidth: 1, borderTopColor: colors.border },
  mealName: { color: colors.text, flex: 1, marginRight: spacing(1) },
  mealMacros: { color: colors.textMuted, fontSize: 12 }
});
