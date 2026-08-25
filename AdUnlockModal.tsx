import React, { useState } from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import PrimaryButton from "./PrimaryButton";
import { colors, radius, spacing } from "../theme";

interface Props {
  visible: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onRewardEarned: () => void;
}

/**
 * UI shell for the "watch a 1-min ad, unlock 3 workouts / extra meal days"
 * flow. Wire `showRewardedAd` below to react-native-google-mobile-ads'
 * RewardedAd (or AdMob directly). This component only handles the UI state;
 * the actual ad SDK call happens in showRewardedAd().
 */
export default function AdUnlockModal({ visible, title, description, onClose, onRewardEarned }: Props) {
  const [playing, setPlaying] = useState(false);

  async function showRewardedAd() {
    setPlaying(true);
    try {
      // --- Real implementation sketch (react-native-google-mobile-ads) ---
      // import { RewardedAd, RewardedAdEventType, TestIds } from "react-native-google-mobile-ads";
      // const rewarded = RewardedAd.createForAdRequest(YOUR_AD_UNIT_ID);
      // await new Promise<void>((resolve, reject) => {
      //   const unsubEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      //     onRewardEarned();
      //     resolve();
      //   });
      //   const unsubLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => rewarded.show());
      //   rewarded.load();
      // });

      // Placeholder for local dev/testing:
      await new Promise((r) => setTimeout(r, 1200));
      onRewardEarned();
    } finally {
      setPlaying(false);
      onClose();
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <PrimaryButton label={playing ? "Loading ad..." : "Watch ad to unlock"} onPress={showRewardedAd} loading={playing} />
          <PrimaryButton label="Not now" onPress={onClose} variant="ghost" style={{ marginTop: spacing(1) }} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing(3),
    paddingBottom: spacing(5)
  },
  title: { fontSize: 20, fontWeight: "700", color: colors.text, marginBottom: spacing(1) },
  description: { fontSize: 14, color: colors.textMuted, marginBottom: spacing(3) }
});
