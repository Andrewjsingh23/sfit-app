import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from "react-native";
import { useApp } from "../context/AppContext";
import { colors, radius, spacing, typography } from "../theme";
import { WorkoutLocation } from "../types";

export default function SettingsScreen() {
  const { profile, signOut } = useApp();
  const [spotifyConnected, setSpotifyConnected] = React.useState(false);

  if (!profile) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing(3), paddingTop: spacing(7), paddingBottom: spacing(6) }}>
      <Text style={typography.h1}>Settings</Text>

      <View style={styles.freeBanner}>
        <Text style={styles.freeBannerText}>✓ FitForge is 100% free — no subscription, ever.</Text>
      </View>

      <Section title="Profile">
        <Row label="Name" value={profile.name} />
        <Row label="Email" value={profile.email} />
        <Row label="Height" value={`${profile.heightCm} cm`} />
        <Row label="Weight" value={`${profile.weightKg} kg`} />
        <Row label="Training location" value={profile.location === "home" ? "At home" : "At the gym"} />
      </Section>

      <Section title="Music">
        <Pressable style={styles.musicRow} onPress={() => setSpotifyConnected((v) => !v)}>
          <Text style={styles.rowLabel}>Connect Spotify</Text>
          <Switch value={spotifyConnected} onValueChange={setSpotifyConnected} trackColor={{ true: colors.primary }} />
        </Pressable>
        <Text style={typography.caption}>
          When connected, your last-played Spotify playlist resumes automatically when you start a workout.
        </Text>
      </Section>

      <Section title="Account">
        <Pressable onPress={signOut}>
          <Text style={{ color: colors.danger, fontWeight: "600" }}>Sign out</Text>
        </Pressable>
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: spacing(4) }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  freeBanner: { backgroundColor: colors.primaryMuted, borderRadius: radius.md, padding: spacing(2), marginTop: spacing(2) },
  freeBannerText: { color: colors.primary, fontWeight: "700", textAlign: "center" },
  sectionTitle: { ...typography.caption, textTransform: "uppercase", marginBottom: spacing(1) },
  sectionBody: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing(2), borderWidth: 1, borderColor: colors.border, gap: spacing(1) },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing(0.5) },
  musicRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowLabel: { color: colors.textMuted },
  rowValue: { color: colors.text, fontWeight: "600" }
});
