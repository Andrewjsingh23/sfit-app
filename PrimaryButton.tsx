import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle } from "react-native";
import { colors, radius, spacing } from "../theme";

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "accent" | "secondary" | "ghost";
  style?: ViewStyle;
}

export default function PrimaryButton({ label, onPress, loading, disabled, variant = "primary", style }: Props) {
  const isFilled = variant === "primary" || variant === "accent";
  const textColor = variant === "primary" ? colors.primaryText : variant === "accent" ? colors.secondaryText : colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "accent" && styles.accent,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        pressed && { opacity: 0.85 },
        (disabled || loading) && { opacity: 0.5 },
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isFilled ? textColor : colors.text} />
      ) : (
        <Text style={[styles.label, isFilled && { color: textColor }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(3),
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52
  },
  primary: { backgroundColor: colors.primary }, // orange — main/exciting CTAs (start workout, unlock via ad)
  accent: { backgroundColor: colors.secondary }, // blue — secondary CTAs (continue, log set)
  secondary: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
  ghost: { backgroundColor: "transparent" },
  label: { fontSize: 16, fontWeight: "700", color: colors.text }
});
