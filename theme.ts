export const colors = {
  bg: "#0A1120", // deep navy
  surface: "#121B30",
  surfaceAlt: "#1B2740",
  primary: "#E8762E", // Citron Pulse orange (Nike Streakfly 2 inspired), used for primary CTAs/highlights
  primaryMuted: "#3A2A18",
  primaryText: "#1A0D04", // dark text for use on top of the orange primary color
  secondary: "#3B82F6", // Racer Blue, used for structural accents (badges, secondary actions)
  secondaryText: "#03101F", // dark text for use on top of the blue secondary color
  text: "#BFD9FF", // light blue replaces pure white for all primary text/icons
  textMuted: "#6E85AC",
  danger: "#EF4444",
  border: "#2A3A5C"
};

export const spacing = (n: number) => n * 8;

export const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999
};

export const typography = {
  h1: { fontSize: 28, fontWeight: "700" as const, color: colors.text },
  h2: { fontSize: 20, fontWeight: "700" as const, color: colors.text },
  body: { fontSize: 15, fontWeight: "400" as const, color: colors.text },
  caption: { fontSize: 13, fontWeight: "400" as const, color: colors.textMuted }
};
