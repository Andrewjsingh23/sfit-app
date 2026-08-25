import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from "react-native";
import { EXERCISES } from "../data/exercises";
import { colors, radius, spacing, typography } from "../theme";
import { Exercise } from "../types";

export default function ExerciseLibraryScreen({ onSelect }: { onSelect: (exercise: Exercise) => void }) {
  const [query, setQuery] = useState("");

  const filtered = EXERCISES.filter(
    (e) => e.name.toLowerCase().includes(query.toLowerCase()) || e.muscleGroups.some((m) => m.includes(query.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <Text style={[typography.h1, { padding: spacing(3), paddingTop: spacing(7), paddingBottom: spacing(1) }]}>Exercise Library</Text>
      <TextInput
        style={styles.search}
        placeholder="Search exercises or muscle groups"
        placeholderTextColor={colors.textMuted}
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        contentContainerStyle={{ padding: spacing(3), paddingTop: spacing(2), paddingBottom: spacing(6) }}
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => onSelect(item)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.muscles}>{item.muscleGroups.join(", ")}</Text>
            </View>
            <Text style={styles.equipment}>{item.equipment}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  search: {
    marginHorizontal: spacing(3),
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.25),
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing(2),
    marginBottom: spacing(1),
    borderWidth: 1,
    borderColor: colors.border
  },
  name: { color: colors.text, fontWeight: "600" },
  muscles: { color: colors.textMuted, fontSize: 12, marginTop: 2, textTransform: "capitalize" },
  equipment: { color: colors.primary, fontSize: 12, textTransform: "capitalize" }
});
