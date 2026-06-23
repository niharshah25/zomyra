import { ArrowLeft } from "lucide-react-native";
import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, radii } from "@/src/theme/colors";

type Props = {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  onBack: () => void;
  onNext: () => void;
  canNext: boolean;
  nextLabel?: string;
  loading?: boolean;
  hideStepLabel?: boolean;
  children: ReactNode;
};

export function OnboardingShell({
  step,
  total,
  title,
  subtitle,
  onBack,
  onNext,
  canNext,
  nextLabel = "Continue",
  loading,
  hideStepLabel,
  children,
}: Props) {
  const insets = useSafeAreaInsets();
  const pct = Math.min(100, Math.round(((step + 1) / total) * 100));
  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable
            testID="onboarding-back"
            onPress={onBack}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
            hitSlop={8}
          >
            <ArrowLeft size={20} color={colors.foreground} strokeWidth={2.2} />
          </Pressable>
          {!hideStepLabel ? (
            <Text style={styles.stepLabel}>
              Step {step + 1} of {total}
            </Text>
          ) : (
            <View />
          )}
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: `${pct}%` }]} />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          <View style={{ marginTop: 24, width: "100%" }}>{children}</View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable
          testID="onboarding-next"
          disabled={!canNext || loading}
          onPress={onNext}
          style={({ pressed }) => [
            styles.nextBtn,
            (!canNext || loading) && styles.nextBtnDisabled,
            pressed && canNext && { opacity: 0.92 },
          ]}
        >
          {loading ? <ActivityIndicator color={colors.primaryForeground} /> : null}
          <Text style={styles.nextLabel}>{nextLabel}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 10,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -8,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.4,
    color: colors.mutedForeground,
    textTransform: "uppercase",
  },
  progressTrack: {
    marginTop: 12,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.secondary,
    overflow: "hidden",
  },
  progressBar: {
    height: 5,
    backgroundColor: colors.primary,
    borderRadius: 999,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 30,
    letterSpacing: -0.3,
    color: colors.foreground,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: colors.mutedForeground,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  nextBtn: {
    height: 52,
    borderRadius: radii.md + 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  nextBtnDisabled: {
    backgroundColor: "#D6CFE0",
  },
  nextLabel: {
    color: colors.primaryForeground,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.1,
  },
});
