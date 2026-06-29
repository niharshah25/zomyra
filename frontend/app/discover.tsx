/**
 * Discover screen — Premium matrimony feed.
 *
 * Header (Zomyra + bell) → filter chips row → "best XXX matches" banner →
 * interleaved photo/info card profile. Tapping the Compatibility chip
 * opens the Discovery Mode bottom sheet.
 */
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ChevronDown, Crown, SlidersHorizontal, Sparkles } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { Easing, FadeIn, FadeOut } from "react-native-reanimated";

import { Wordmark } from "@/src/components/brand/Logo";
import { CompatibilitySheet } from "@/src/components/discover/CompatibilitySheet";
import { DualRangeSlider } from "@/src/components/discover/DualRangeSlider";
import { PremiumFilterDialog } from "@/src/components/discover/PremiumFilterDialog";
import { ProfileView } from "@/src/components/discover/ProfileView";
import { FloatingNav } from "@/src/components/nav/FloatingNav";
import type { CompatibilityDimension } from "@/src/lib/discover/mock";
import { discoverService } from "@/src/services/discover";

const PURPLE = "#5B2C6F";
const LIGHT_PURPLE = "#F5F3FF";
const BORDER = "#ECEAF7";
const TEXT = "#111827";
const MUTED = "#6B7280";

type QuickKey = "height" | "build" | "income" | "education";
const QUICK_CHIPS: { key: QuickKey; label: string }[] = [
  { key: "height", label: "Height" },
  { key: "build", label: "Build" },
  { key: "income", label: "Income" },
  { key: "education", label: "Education" },
];

const BUILD_OPTIONS = ["Slim", "Average", "Athletic", "Heavy"];
const INCOME_OPTIONS = [
  "Below ₹5 LPA",
  "₹5–10 LPA",
  "₹10–20 LPA",
  "₹20–35 LPA",
  "₹35–50 LPA",
  "₹50L+",
];
const EDUCATION_OPTIONS = [
  "High School",
  "Diploma",
  "Bachelor's",
  "Master's",
  "MBA",
  "Doctorate",
  "Other",
];

const HEIGHT_MIN = 140;
const HEIGHT_MAX = 200;

const DIM_LABEL: Record<CompatibilityDimension, string> = {
  all: "All",
  personality: "Compatibility",
  lifestyle: "Lifestyle",
  priorities: "Marriage Goals",
};

export default function Discover() {
  const router = useRouter();
  const { data: profiles = [] } = useQuery({
    queryKey: ["discover-profiles"],
    queryFn: () => discoverService.list(),
  });
  const [dimension, setDimension] = useState<CompatibilityDimension>("all");
  const [idx, setIdx] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [quickKey, setQuickKey] = useState<QuickKey | null>(null);

  // Draft values inside the centered dialog — never persisted because all
  // four filters are Premium (Apply → /premium).
  const [heightRange, setHeightRange] = useState<[number, number]>([150, 195]);
  const [buildPick, setBuildPick] = useState<string | null>(null);
  const [incomePick, setIncomePick] = useState<string | null>(null);
  const [educationPick, setEducationPick] = useState<string | null>(null);

  const sortedProfiles = useMemo(() => {
    return [...profiles].sort((a, b) => {
      const sa = a.scores?.[dimension]?.score ?? 0;
      const sb = b.scores?.[dimension]?.score ?? 0;
      return sb - sa;
    });
  }, [profiles, dimension]);

  useEffect(() => {
    setIdx(0);
  }, [dimension]);

  const advance = () => {
    if (sortedProfiles.length === 0) return;
    setIdx((i) => (i + 1) % sortedProfiles.length);
  };

  const profile = sortedProfiles[idx];
  const dimLabel = DIM_LABEL[dimension];

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      {/* Header — [All matches ▼] [Zomyra] [Filters] */}
      <View style={styles.header}>
        <Pressable
          testID="filter-chip-compatibility"
          onPress={() => setSheetOpen(true)}
          style={({ pressed }) => [
            styles.headerPill,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Sparkles size={14} color={PURPLE} strokeWidth={2} />
          <Text style={styles.headerPillText} numberOfLines={1}>
            {dimLabel} matches
          </Text>
          <ChevronDown size={14} color={PURPLE} strokeWidth={2} />
        </Pressable>

        <View style={styles.headerCenter} pointerEvents="none">
          <Wordmark fontSize={26} />
        </View>

        <Pressable
          testID="filter-icon"
          onPress={() => router.push("/filters" as never)}
          style={({ pressed }) => [
            styles.headerPill,
            styles.headerPillRight,
            pressed && { opacity: 0.85 },
          ]}
        >
          <SlidersHorizontal size={16} color={PURPLE} strokeWidth={2} />
          <Text style={styles.headerPillText}>Filters</Text>
        </Pressable>
      </View>

      {/* "Showing your best XXX matches" banner */}
      <View style={styles.banner}>
        <Sparkles size={14} color={PURPLE} strokeWidth={2} />
        <Text style={styles.bannerText}>
          Showing your best <Text style={styles.bannerHi}>{dimLabel}</Text> matches
        </Text>
      </View>

      {/* Filter chip row — [Height 👑] [Build 👑] [Income 👑] [Education 👑] */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {QUICK_CHIPS.map((c) => (
          <Pressable
            key={c.key}
            testID={`filter-chip-${c.key}`}
            onPress={() => setQuickKey(c.key)}
            style={styles.chip}
          >
            <Text style={styles.chipLabel}>{c.label}</Text>
            <Crown size={12} color="#F59E0B" strokeWidth={2} fill="#F59E0B" />
            <ChevronDown size={14} color={MUTED} strokeWidth={2} />
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 4 }}
        showsVerticalScrollIndicator={false}
        testID="discover-scroll"
      >
        {profile ? (
          <Animated.View
            key={`${profile.id}-${dimension}`}
            entering={FadeIn.duration(300).easing(Easing.out(Easing.cubic))}
            exiting={FadeOut.duration(180)}
            testID="discover-card"
          >
            <ProfileView
              profile={profile}
              dimension={dimension}
              onPass={advance}
              onConnect={advance}
            />
          </Animated.View>
        ) : (
          <Text style={styles.empty}>Loading…</Text>
        )}
      </ScrollView>

      <FloatingNav />

      <CompatibilitySheet
        visible={sheetOpen}
        selected={dimension}
        onClose={() => setSheetOpen(false)}
        onApply={(next) => setDimension(next)}
      />

      {/* ── Premium filter dialogs — Apply routes to /premium ── */}
      {(() => {
        const close = () => setQuickKey(null);
        const goPremium = () => {
          close();
          router.push("/premium" as never);
        };
        return (
          <>
            <PremiumFilterDialog
              visible={quickKey === "height"}
              title="Height"
              subtitle="Filter matches by height range."
              onClose={close}
              onApply={goPremium}
              applyLabel="Apply"
            >
              <DualRangeSlider
                min={HEIGHT_MIN}
                max={HEIGHT_MAX}
                low={heightRange[0]}
                high={heightRange[1]}
                onChange={(lo, hi) => setHeightRange([lo, hi])}
                format={(v) => `${v} cm`}
              />
            </PremiumFilterDialog>

            <PremiumFilterDialog
              visible={quickKey === "build"}
              title="Build"
              subtitle="Pick a body type."
              onClose={close}
              onApply={goPremium}
            >
              <ChipPicker
                options={BUILD_OPTIONS}
                value={buildPick}
                onChange={setBuildPick}
              />
            </PremiumFilterDialog>

            <PremiumFilterDialog
              visible={quickKey === "income"}
              title="Income"
              subtitle="Annual income range."
              onClose={close}
              onApply={goPremium}
            >
              <OptionList
                options={INCOME_OPTIONS}
                value={incomePick}
                onChange={setIncomePick}
              />
            </PremiumFilterDialog>

            <PremiumFilterDialog
              visible={quickKey === "education"}
              title="Education"
              subtitle="Highest education level."
              onClose={close}
              onApply={goPremium}
            >
              <OptionList
                options={EDUCATION_OPTIONS}
                value={educationPick}
                onChange={setEducationPick}
              />
            </PremiumFilterDialog>
          </>
        );
      })()}
    </SafeAreaView>
  );
}

// ─────────────────────────── helpers ───────────────────────────

function ChipPicker({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.chipPickerWrap}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <Pressable
            key={opt}
            testID={`dialog-chip-${opt}`}
            onPress={() => onChange(opt)}
            style={[styles.pickerChip, active && styles.pickerChipActive]}
          >
            <Text
              style={[styles.pickerChipText, active && styles.pickerChipTextActive]}
            >
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function OptionList({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <View style={{ gap: 8 }}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <Pressable
            key={opt}
            testID={`dialog-option-${opt}`}
            onPress={() => onChange(opt)}
            style={[styles.optionRow, active && styles.optionRowActive]}
          >
            <Text
              style={[styles.optionRowText, active && styles.optionRowTextActive]}
            >
              {opt}
            </Text>
            <View style={[styles.radio, active && styles.radioActive]}>
              {active ? <View style={styles.radioDot} /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },

  // header
  header: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  headerCenter: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  headerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFF",
    maxWidth: 160,
  },
  headerPillRight: {
    backgroundColor: LIGHT_PURPLE,
  },
  headerPillText: {
    fontSize: 13,
    fontWeight: "700",
    color: PURPLE,
    letterSpacing: -0.1,
  },

  // chip row
  chipsRow: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chip: {
    flexShrink: 0,
    height: 40,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT,
    letterSpacing: -0.1,
  },

  // ── Premium dialog inner pickers ──
  chipPickerWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pickerChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFF",
  },
  pickerChipActive: { borderColor: PURPLE, backgroundColor: LIGHT_PURPLE },
  pickerChipText: { fontSize: 14, fontWeight: "600", color: TEXT },
  pickerChipTextActive: { color: PURPLE, fontWeight: "700" },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFF",
  },
  optionRowActive: { borderColor: PURPLE, backgroundColor: LIGHT_PURPLE },
  optionRowText: { fontSize: 15, fontWeight: "600", color: TEXT },
  optionRowTextActive: { color: PURPLE, fontWeight: "700" },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: PURPLE },
  radioDot: { width: 10, height: 10, borderRadius: 999, backgroundColor: PURPLE },

  // banner
  banner: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: LIGHT_PURPLE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: BORDER,
  },
  bannerText: { fontSize: 13, fontWeight: "500", color: TEXT },
  bannerHi: { color: PURPLE, fontWeight: "700" },

  empty: { padding: 32, textAlign: "center", color: MUTED },
});
