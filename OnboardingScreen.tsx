import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { colors, radius, spacing, typography } from "../theme";
import { EventType, ExperienceLevel, Goal, Sex, UserProfile, WorkoutLocation } from "../types";

interface Props {
  auth: { provider: "google" | "apple" | "facebook" | "email"; email: string; name: string };
  onComplete: (profile: UserProfile) => void;
}

const GOALS: { key: Goal; label: string; blurb: string }[] = [
  { key: "lose_weight", label: "Lose weight", blurb: "Calorie-focused, cardio-forward plan" },
  { key: "gain_muscle", label: "Gain muscle", blurb: "Balanced hypertrophy training" },
  { key: "bulk", label: "Bulk up", blurb: "Higher volume, calorie surplus" },
  { key: "glutes_legs", label: "Booty & leg gains", blurb: "Glute- and leg-focused programming" },
  { key: "event_training", label: "Train for an event", blurb: "Hyrox, marathon, and more" }
];

const EVENTS: { key: EventType; label: string }[] = [
  { key: "hyrox", label: "Hyrox" },
  { key: "marathon", label: "Marathon" },
  { key: "half_marathon", label: "Half marathon" },
  { key: "triathlon", label: "Triathlon" },
  { key: "obstacle_race", label: "Obstacle race" },
  { key: "other", label: "Other" }
];

type Step = "personal" | "goal" | "event" | "level" | "diet";

export default function OnboardingScreen({ auth, onComplete }: Props) {
  const [step, setStep] = useState<Step>("personal");

  const [birthday, setBirthday] = useState(""); // YYYY-MM-DD
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [sex, setSex] = useState<Sex>("unspecified");

  const [goal, setGoal] = useState<Goal | null>(null);
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [eventDate, setEventDate] = useState("");

  const [level, setLevel] = useState<ExperienceLevel>("beginner");
  const [location, setLocation] = useState<WorkoutLocation>("home");
  const [planLengthDays, setPlanLengthDays] = useState<30 | 45 | 60>(30);
  const [wantsDietPlan, setWantsDietPlan] = useState(true);

  function next() {
    if (step === "personal") setStep("goal");
    else if (step === "goal") setStep(goal === "event_training" ? "event" : "level");
    else if (step === "event") setStep("level");
    else if (step === "level") setStep("diet");
    else if (step === "diet") finish();
  }

  function finish() {
    if (!goal) return;
    const profile: UserProfile = {
      id: `${auth.provider}-${Date.now()}`,
      authProvider: auth.provider,
      email: auth.email,
      name: auth.name,
      birthday: birthday || "1995-01-01",
      heightCm: Number(heightCm) || 170,
      weightKg: Number(weightKg) || 70,
      sex,
      goal,
      eventType: goal === "event_training" ? eventType ?? "other" : undefined,
      eventDate: goal === "event_training" ? eventDate : undefined,
      experienceLevel: level,
      location,
      planLengthDays,
      wantsDietPlan,
      createdAt: new Date().toISOString()
    };
    onComplete(profile);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing(3), paddingTop: spacing(8) }}>
      <Text style={typography.h1}>
        {step === "personal" && "Tell us about you"}
        {step === "goal" && "What's your goal?"}
        {step === "event" && "Which event?"}
        {step === "level" && "How do you train?"}
        {step === "diet" && "Add a nutrition plan?"}
      </Text>
      <Text style={[typography.caption, { marginTop: spacing(1), marginBottom: spacing(3) }]}>
        This personalizes every workout — it's never sold or shared.
      </Text>

      {step === "personal" && (
        <View style={{ gap: spacing(2) }}>
          <Field label="Birthday (YYYY-MM-DD)" value={birthday} onChangeText={setBirthday} placeholder="1995-06-12" />
          <Field label="Height (cm)" value={heightCm} onChangeText={setHeightCm} placeholder="175" keyboardType="numeric" />
          <Field label="Weight (kg)" value={weightKg} onChangeText={setWeightKg} placeholder="72" keyboardType="numeric" />
          <ChoiceRow
            label="Sex (used only for calorie estimates)"
            options={[
              { key: "female", label: "Female" },
              { key: "male", label: "Male" },
              { key: "unspecified", label: "Prefer not to say" }
            ]}
            selected={sex}
            onSelect={(k) => setSex(k as Sex)}
          />
        </View>
      )}

      {step === "goal" && (
        <View style={{ gap: spacing(1.5) }}>
          {GOALS.map((g) => (
            <SelectCard key={g.key} title={g.label} subtitle={g.blurb} selected={goal === g.key} onPress={() => setGoal(g.key)} />
          ))}
        </View>
      )}

      {step === "event" && (
        <View style={{ gap: spacing(1.5) }}>
          <ChoiceRow
            label="Event type"
            options={EVENTS.map((e) => ({ key: e.key, label: e.label }))}
            selected={eventType ?? ""}
            onSelect={(k) => setEventType(k as EventType)}
          />
          <Field label="Event date (YYYY-MM-DD)" value={eventDate} onChangeText={setEventDate} placeholder="2026-11-01" />
        </View>
      )}

      {step === "level" && (
        <View style={{ gap: spacing(3) }}>
          <ChoiceRow
            label="Experience level"
            options={[
              { key: "beginner", label: "Beginner" },
              { key: "intermediate", label: "Medium" },
              { key: "expert", label: "Expert" }
            ]}
            selected={level}
            onSelect={(k) => setLevel(k as ExperienceLevel)}
          />
          <ChoiceRow
            label="Where do you train?"
            options={[
              { key: "home", label: "At home" },
              { key: "gym", label: "At the gym" }
            ]}
            selected={location}
            onSelect={(k) => setLocation(k as WorkoutLocation)}
          />
          <ChoiceRow
            label="Plan length"
            options={[
              { key: "30", label: "30 days" },
              { key: "45", label: "45 days" },
              { key: "60", label: "60 days" }
            ]}
            selected={String(planLengthDays)}
            onSelect={(k) => setPlanLengthDays(Number(k) as 30 | 45 | 60)}
          />
        </View>
      )}

      {step === "diet" && (
        <View style={{ gap: spacing(1.5) }}>
          <SelectCard
            title="Yes, build me a 60-day meal plan"
            subtitle="Calorie & macro targets based on your stats and goal"
            selected={wantsDietPlan}
            onPress={() => setWantsDietPlan(true)}
          />
          <SelectCard title="Skip for now" subtitle="You can add this later from Settings" selected={!wantsDietPlan} onPress={() => setWantsDietPlan(false)} />
        </View>
      )}

      <PrimaryButton
        label={step === "diet" ? "Build my plan" : "Continue"}
        onPress={next}
        disabled={step === "goal" && !goal}
        variant="accent"
        style={{ marginTop: spacing(4) }}
      />
    </ScrollView>
  );
}

function Field(props: { label: string; value: string; onChangeText: (t: string) => void; placeholder?: string; keyboardType?: "default" | "numeric" }) {
  return (
    <View>
      <Text style={styles.fieldLabel}>{props.label}</Text>
      <TextInput
        style={styles.input}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={props.keyboardType ?? "default"}
      />
    </View>
  );
}

function ChoiceRow(props: { label: string; options: { key: string; label: string }[]; selected: string; onSelect: (k: string) => void }) {
  return (
    <View>
      <Text style={styles.fieldLabel}>{props.label}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing(1) }}>
        {props.options.map((o) => (
          <Pressable
            key={o.key}
            onPress={() => props.onSelect(o.key)}
            style={[styles.chip, props.selected === o.key && styles.chipSelected]}
          >
            <Text style={[styles.chipText, props.selected === o.key && styles.chipTextSelected]}>{o.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function SelectCard(props: { title: string; subtitle: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={props.onPress} style={[styles.card, props.selected && styles.cardSelected]}>
      <Text style={styles.cardTitle}>{props.title}</Text>
      <Text style={styles.cardSubtitle}>{props.subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  fieldLabel: { ...typography.caption, marginBottom: spacing(0.75) },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing(2),
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border
  },
  chip: {
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(2),
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontWeight: "600" },
  chipTextSelected: { color: colors.primaryText },
  card: { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: spacing(2), borderWidth: 1, borderColor: colors.border },
  cardSelected: { borderColor: colors.primary, backgroundColor: colors.primaryMuted },
  cardTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  cardSubtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 }
});
