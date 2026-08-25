import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Exercise } from "../types";
import { colors, radius, spacing, typography } from "../theme";

export default function ExerciseDetailScreen({ exercise, onBack }: { exercise: Exercise; onBack: () => void }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing(6) }}>
      <Pressable onPress={onBack} style={{ padding: spacing(3), paddingTop: spacing(7) }}>
        <Text style={{ color: colors.textMuted }}>← Back</Text>
      </Pressable>

      <View style={styles.videoWrap}>
        {exercise.videoUrl ? (
          <Video source={{ uri: exercise.videoUrl }} resizeMode={ResizeMode.COVER} isLooping shouldPlay isMuted style={styles.video} />
        ) : (
          <View style={[styles.video, { alignItems: "center", justifyContent: "center" }]}>
            <Text style={{ color: colors.textMuted }}>No demo video yet</Text>
          </View>
        )}
      </View>

      <View style={{ padding: spacing(3) }}>
        <Text style={typography.h1}>{exercise.name}</Text>
        <Text style={typography.caption}>{exercise.muscleGroups.join(" · ")}</Text>

        <Text style={[typography.h2, { marginTop: spacing(3) }]}>Form pointers</Text>
        {exercise.formCues.map((cue, i) => (
          <Text key={i} style={styles.cue}>
            {i + 1}. {cue}
          </Text>
        ))}

        <Text style={[typography.h2, { marginTop: spacing(3) }]}>Suggested</Text>
        <Text style={typography.body}>
          {exercise.defaultSets} sets × {exercise.defaultReps}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  videoWrap: { marginHorizontal: spacing(3), borderRadius: radius.lg, overflow: "hidden", backgroundColor: colors.surfaceAlt },
  video: { width: "100%", height: 240 },
  cue: { color: colors.text, marginTop: spacing(1), fontSize: 15 }
});
