import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Platform } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { colors, spacing, typography, radius } from "../theme";

interface Props {
  onAuthenticated: (auth: { provider: "google" | "apple" | "facebook" | "email"; email: string; name: string }) => void;
}

/**
 * UI + flow control for sign-in. The actual OAuth calls are stubbed with
 * clear TODOs — see README "Authentication" section for the real setup
 * (Firebase Auth is the fastest path for Google/Apple/Facebook/email all at
 * once, and gives you a ready-made backend user table).
 */
export default function AuthScreen({ onAuthenticated }: Props) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    setLoadingProvider("google");
    try {
      // TODO: @react-native-google-signin/google-signin
      // await GoogleSignin.configure({ webClientId: YOUR_WEB_CLIENT_ID });
      // const { data } = await GoogleSignin.signIn();
      // onAuthenticated({ provider: "google", email: data.user.email, name: data.user.name ?? "" });
      await new Promise((r) => setTimeout(r, 600));
      onAuthenticated({ provider: "google", email: "demo.user@gmail.com", name: "Demo User" });
    } finally {
      setLoadingProvider(null);
    }
  }

  async function handleAppleSignIn() {
    if (Platform.OS !== "ios") return;
    setLoadingProvider("apple");
    try {
      // TODO: expo-apple-authentication
      // const credential = await AppleAuthentication.signInAsync({
      //   requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
      // });
      // onAuthenticated({ provider: "apple", email: credential.email ?? "", name: credential.fullName?.givenName ?? "" });
      await new Promise((r) => setTimeout(r, 600));
      onAuthenticated({ provider: "apple", email: "demo.user@icloud.com", name: "Demo User" });
    } finally {
      setLoadingProvider(null);
    }
  }

  async function handleFacebookSignIn() {
    setLoadingProvider("facebook");
    try {
      // TODO: react-native-fbsdk-next LoginManager.logInWithPermissions(["public_profile", "email"])
      await new Promise((r) => setTimeout(r, 600));
      onAuthenticated({ provider: "facebook", email: "demo.user@facebook.com", name: "Demo User" });
    } finally {
      setLoadingProvider(null);
    }
  }

  function handleEmailContinue() {
    if (!email.includes("@") || !name.trim()) return;
    onAuthenticated({ provider: "email", email, name });
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={styles.logo}>FitForge</Text>
        <Text style={styles.tagline}>Free. No subscription. Ever.</Text>
      </View>

      <View style={{ gap: spacing(1.5) }}>
        {!showEmailForm ? (
          <>
            <PrimaryButton label="Continue with Google" onPress={handleGoogleSignIn} loading={loadingProvider === "google"} />
            {Platform.OS === "ios" && (
              <PrimaryButton label="Continue with Apple" onPress={handleAppleSignIn} loading={loadingProvider === "apple"} variant="secondary" />
            )}
            <PrimaryButton label="Continue with Facebook" onPress={handleFacebookSignIn} loading={loadingProvider === "facebook"} variant="secondary" />
            <PrimaryButton label="Continue with email" onPress={() => setShowEmailForm(true)} variant="ghost" />
          </>
        ) : (
          <>
            <TextInput style={styles.input} placeholder="Name" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <PrimaryButton label="Continue" onPress={handleEmailContinue} />
            <PrimaryButton label="Back" onPress={() => setShowEmailForm(false)} variant="ghost" />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing(3), paddingTop: spacing(10), paddingBottom: spacing(6) },
  logo: { ...typography.h1, fontSize: 36, textAlign: "center" },
  tagline: { ...typography.caption, textAlign: "center", marginTop: spacing(1) },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing(2),
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border
  }
});
