/**
 * Filters screen — opened from the SlidersHorizontal icon on Discover.
 *
 * Two sections:
 *   • Basic Filters   — tap to open the per-field selector sheet
 *   • Premium Filters 👑 — locked rows that route to /premium when tapped
 */
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Cigarette,
  Crown,
  Dumbbell,
  GraduationCap,
  Heart,
  Home,
  IndianRupee,
  Landmark,
  Languages as LanguagesIcon,
  Leaf,
  Lock,
  MapPin,
  Ruler,
  User,
  Wine,
  type LucideIcon,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FilterOptionSheet } from "@/src/components/discover/FilterOptionSheet";
import {
  FILTER_LABEL,
  FILTER_OPTIONS,
  useDiscoverFilters,
  type FilterKey,
} from "@/src/stores/discover-filters-store";

const PURPLE = "#5B2C6F";
const LIGHT_PURPLE = "#F5F3FF";
const BORDER = "#ECEAF7";
const TEXT = "#111827";
const MUTED = "#6B7280";

type BasicRow = {
  key: FilterKey | "smoking";
  label: string;
  Icon: LucideIcon;
};

const BASIC_ROWS: BasicRow[] = [
  { key: "age", label: "Age", Icon: Calendar },
  { key: "location", label: "Location", Icon: MapPin },
  { key: "religion", label: "Religion", Icon: Landmark },
  { key: "diet", label: "Diet", Icon: Leaf },
  { key: "smoking", label: "Smoking", Icon: Cigarette },
];

type PremiumRow = { key: string; label: string; Icon: LucideIcon };

const PREMIUM_ROWS: PremiumRow[] = [
  { key: "height", label: "Height", Icon: Ruler },
  { key: "build", label: "Build", Icon: User },
  { key: "education", label: "Education", Icon: GraduationCap },
  { key: "profession", label: "Profession", Icon: Briefcase },
  { key: "income", label: "Income Range", Icon: IndianRupee },
  { key: "family", label: "Family Type", Icon: Home },
  { key: "children", label: "Children", Icon: Heart },
  { key: "language", label: "Language", Icon: LanguagesIcon },
  { key: "drinking", label: "Drinking", Icon: Wine },
];

// Extra basic filter that lives only on this screen (not on the Discover chip
// row) — single-select on/off via the same option sheet for now.
const SMOKING_OPTIONS = ["Non-smoker", "Occasional", "Regular", "Doesn't matter"];

export default function FiltersScreen() {
  const router = useRouter();
  const filters = useDiscoverFilters();
  const [activeKey, setActiveKey] = useState<FilterKey | "smoking" | null>(null);
  const [smoking, setSmoking] = useState<string | null>(null);

  const valueOf = (key: BasicRow["key"]): string | null => {
    if (key === "smoking") return smoking;
    return filters[key];
  };

  const openSheet = (key: BasicRow["key"]) => {
    setActiveKey(key);
  };

  const closeSheet = () => setActiveKey(null);

  const sheetOptions =
    activeKey === "smoking"
      ? SMOKING_OPTIONS
      : activeKey
        ? FILTER_OPTIONS[activeKey]
        : [];

  const sheetSelected =
    activeKey === "smoking" ? smoking : activeKey ? filters[activeKey] : null;

  const sheetTitle =
    activeKey === "smoking"
      ? "Smoking"
      : activeKey
        ? FILTER_LABEL[activeKey]
        : "";

  const onApply = (value: string | null) => {
    if (activeKey === "smoking") setSmoking(value);
    else if (activeKey) filters.set(activeKey, value);
  };

  const onReset = () => {
    filters.reset();
    setSmoking(null);
  };

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          testID="filters-back"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
          hitSlop={8}
        >
          <ArrowLeft size={22} color={TEXT} strokeWidth={2} />
        </Pressable>
        <Text style={styles.headerTitle}>Filters</Text>
        <Pressable
          testID="filters-reset"
          onPress={onReset}
          style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
          hitSlop={8}
        >
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Filters */}
        <Text style={styles.sectionTitle}>BASIC FILTERS</Text>
        <View style={styles.card}>
          {BASIC_ROWS.map((row, i) => {
            const v = valueOf(row.key);
            return (
              <Pressable
                key={row.key}
                testID={`filters-row-${row.key}`}
                onPress={() => openSheet(row.key)}
                style={[
                  styles.row,
                  i < BASIC_ROWS.length - 1 && styles.rowDivider,
                ]}
              >
                <View style={styles.rowIcon}>
                  <row.Icon size={18} color={PURPLE} strokeWidth={2} />
                </View>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <View style={{ flex: 1 }} />
                <Text
                  style={[styles.rowValue, v && styles.rowValueSet]}
                  numberOfLines={1}
                >
                  {v ?? "Any"}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Premium Filters */}
        <View style={styles.premiumTitleRow}>
          <Text style={styles.sectionTitle}>PREMIUM FILTERS</Text>
          <Crown size={14} color="#F59E0B" strokeWidth={2} fill="#F59E0B" />
        </View>
        <View style={styles.card}>
          {PREMIUM_ROWS.map((row, i) => (
            <Pressable
              key={row.key}
              testID={`filters-premium-${row.key}`}
              onPress={() => router.push("/premium" as never)}
              style={[
                styles.row,
                i < PREMIUM_ROWS.length - 1 && styles.rowDivider,
              ]}
            >
              <View style={styles.rowIcon}>
                <row.Icon size={18} color={PURPLE} strokeWidth={2} />
              </View>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <View style={{ flex: 1 }} />
              <View style={styles.lockBadge}>
                <Lock size={11} color="#F59E0B" strokeWidth={2.4} />
                <Text style={styles.lockText}>Premium</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <FilterOptionSheet
        visible={activeKey !== null}
        title={sheetTitle}
        options={sheetOptions}
        selected={sheetSelected}
        onClose={closeSheet}
        onApply={onApply}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBtn: {
    minWidth: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: TEXT, letterSpacing: -0.2 },
  resetText: { fontSize: 14, fontWeight: "700", color: PURPLE },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    color: PURPLE,
    textTransform: "uppercase",
    marginTop: 8,
    marginBottom: 10,
  },
  premiumTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 28,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFF",
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: BORDER },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: LIGHT_PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { fontSize: 16, fontWeight: "600", color: TEXT },
  rowValue: { fontSize: 14, color: MUTED, fontWeight: "500", maxWidth: 140 },
  rowValueSet: { color: PURPLE, fontWeight: "700" },

  lockBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  lockText: { fontSize: 11, fontWeight: "700", color: "#92400E" },

  // make linter happy (Dumbbell import unused)
});

// Suppress unused-import warning for icons we keep exported for future rows.
void Dumbbell;
