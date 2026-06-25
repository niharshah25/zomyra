/**
 * ProfileView — shared between Discover, Requests sheet, Chat profile sheet.
 * Photo-first cover header (Airbnb / Instagram style): the hero image spans
 * the full width and ~35% of screen height, with name, age, location, and
 * the compatibility tier badge overlaid on the bottom-left over a subtle
 * dark gradient.
 */
import { LinearGradient } from "expo-linear-gradient";
import { AlertTriangle, Check, Heart, MapPin, Sparkles, X } from "lucide-react-native";
import { useState, type ReactNode } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, radii } from "@/src/theme/colors";
import type { CompatibilityTier, DiscoverProfile } from "@/src/lib/discover/mock";

const SCREEN = Dimensions.get("window");
const SCREEN_W = Math.min(SCREEN.width, 390);
// Cover photo takes ~35% of screen height (within the 30–40% target).
const COVER_H = Math.round(SCREEN.height * 0.35);

type Props = {
  profile: DiscoverProfile;
  onPass?: () => void;
  onConnect?: () => void;
  footer?: ReactNode;
};

const TIER: Record<CompatibilityTier, { dot: string; chipBg: string; chipText: string; chipBorder: string }> = {
  "Excellent Match": {
    dot: "#8B5CF6",
    chipBg: "rgba(139,92,246,0.92)",
    chipText: "#FFFFFF",
    chipBorder: "rgba(255,255,255,0.35)",
  },
  "Great Match": {
    dot: "#10B981",
    chipBg: "rgba(16,185,129,0.92)",
    chipText: "#FFFFFF",
    chipBorder: "rgba(255,255,255,0.35)",
  },
  "Potential Match": {
    dot: "#F59E0B",
    chipBg: "rgba(245,158,11,0.92)",
    chipText: "#FFFFFF",
    chipBorder: "rgba(255,255,255,0.35)",
  },
};

export function ProfileView({ profile, onPass, onConnect, footer }: Props) {
  const tier = TIER[profile.compatibility];
  const [galleryIdx, setGalleryIdx] = useState(0);
  const galleryW = SCREEN_W - 32; // padding 16 each side
  const itemW = galleryW * 0.78;

  return (
    <View style={{ paddingBottom: 8 }}>
      {/* ============ COVER PHOTO HEADER ============ */}
      <View style={styles.cover}>
        <Image source={{ uri: profile.hero }} style={styles.coverImage} />
        {/* Subtle dark gradient (transparent → 70% black) only along the
            bottom half so the rest of the photo stays vibrant. */}
        <LinearGradient
          pointerEvents="none"
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.15)", "rgba(0,0,0,0.72)"]}
          locations={[0, 0.45, 1]}
          style={styles.coverGradient}
        />
        {/* Match tier chip sits just above the identity block. */}
        <View style={styles.coverContent}>
          <View
            style={[
              styles.tierChip,
              { backgroundColor: tier.chipBg, borderColor: tier.chipBorder },
            ]}
          >
            <View style={[styles.tierDot, { backgroundColor: "#fff" }]} />
            <Text style={[styles.tierLabel, { color: tier.chipText }]}>
              {profile.compatibility}
            </Text>
          </View>
          <Text style={styles.coverName} numberOfLines={1}>
            {profile.name}, {profile.age}
          </Text>
          <View style={styles.coverMetaRow}>
            <MapPin size={14} color="rgba(255,255,255,0.95)" strokeWidth={2.4} />
            <Text style={styles.coverMetaText} numberOfLines={1}>
              {profile.location}
            </Text>
          </View>
        </View>
      </View>

      {/* ============ COMPATIBILITY-FIRST CONTENT ============ */}
      <Section
        icon={<Sparkles size={11} color={colors.mutedForeground} />}
        title="Why we think you'll get along"
        firstSection
      >
        <Text style={styles.bodyText}>{profile.summary}</Text>
      </Section>

      {/* Lifestyle */}
      <Section title="Lifestyle">
        <View style={styles.chipRow}>
          {profile.lifestyle.map((t) => (
            <View key={t} style={styles.lifestyleChip}>
              <Text style={styles.lifestyleText}>{t}</Text>
            </View>
          ))}
        </View>
      </Section>

      {/* Snapshot */}
      <Section title="Compatibility snapshot">
        <View style={{ gap: 6 }}>
          {profile.snapshot.map((s) => {
            const isMatch = s.kind === "match";
            return (
              <View
                key={s.label}
                style={[
                  styles.snapshotItem,
                  {
                    backgroundColor: isMatch ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.10)",
                    borderColor: isMatch ? "rgba(16,185,129,0.25)" : "rgba(245,158,11,0.30)",
                  },
                ]}
              >
                <View
                  style={[
                    styles.snapshotIcon,
                    { backgroundColor: isMatch ? "#10B981" : "#F59E0B" },
                  ]}
                >
                  {isMatch ? (
                    <Check size={10} color="#fff" strokeWidth={3} />
                  ) : (
                    <AlertTriangle size={10} color="#fff" strokeWidth={2.8} />
                  )}
                </View>
                <Text style={styles.snapshotText}>{s.label}</Text>
              </View>
            );
          })}
        </View>
      </Section>

      {/* More photos */}
      <View style={{ marginTop: 16 }}>
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={styles.sectionLabel}>MORE PHOTOS</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, gap: 8 }}
          snapToInterval={itemW + 8}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => {
            const x = e.nativeEvent.contentOffset.x;
            const idx = Math.round(x / (itemW + 8));
            setGalleryIdx(Math.max(0, Math.min(profile.gallery.length - 1, idx)));
          }}
        >
          {profile.gallery.map((src, i) => (
            <View
              key={i}
              style={{
                width: itemW,
                aspectRatio: 4 / 5,
                borderRadius: 14,
                overflow: "hidden",
                backgroundColor: colors.secondary,
              }}
            >
              <Image source={{ uri: src }} style={{ width: "100%", height: "100%" }} />
            </View>
          ))}
        </ScrollView>
        <View style={styles.dots}>
          {profile.gallery.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === galleryIdx && { width: 14, backgroundColor: colors.primary },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Values */}
      <Section title="Values & relationship style">
        <View style={styles.factsGrid}>
          {profile.values.map((v) => (
            <View key={v} style={styles.valueCard}>
              <View style={styles.valueCheck}>
                <Check size={10} color={colors.primary} strokeWidth={3} />
              </View>
              <Text style={styles.valueText} numberOfLines={1}>
                {v}
              </Text>
            </View>
          ))}
        </View>
      </Section>

      {/* Quick facts */}
      <Section title="Quick facts">
        <View style={styles.factsGrid}>
          {profile.facts.map((f) => (
            <View key={f.label} style={styles.factCard}>
              <Text style={styles.factLabel}>{f.label.toUpperCase()}</Text>
              <Text style={styles.factValue}>{f.value}</Text>
            </View>
          ))}
        </View>
      </Section>

      {footer ? (
        <View style={{ marginTop: 16, paddingHorizontal: 16, paddingBottom: 8 }}>{footer}</View>
      ) : onPass && onConnect ? (
        <View style={styles.actionsRow}>
          <Pressable
            testID="discover-pass"
            onPress={onPass}
            style={({ pressed }) => [styles.passBtn, pressed && { transform: [{ scale: 0.96 }] }]}
          >
            <X size={20} color={colors.foreground} strokeWidth={2.4} />
          </Pressable>
          <Pressable
            testID="discover-connect"
            onPress={onConnect}
            style={({ pressed }) => [styles.connectBtn, pressed && { transform: [{ scale: 0.96 }] }]}
          >
            <Heart size={20} color="#fff" fill="#fff" />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function Section({
  title,
  icon,
  children,
  firstSection,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  firstSection?: boolean;
}) {
  return (
    <View style={[styles.section, firstSection && { marginTop: 20 }]}>
      <View style={styles.sectionLabelRow}>
        {icon}
        <Text style={styles.sectionLabel}>{title.toUpperCase()}</Text>
      </View>
      <View style={{ marginTop: 6 }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ---- Cover photo header ----
  cover: {
    width: "100%",
    height: COVER_H,
    backgroundColor: colors.secondary,
    overflow: "hidden",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  coverContent: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 18,
  },
  coverName: {
    marginTop: 8,
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.6,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  coverMetaRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  coverMetaText: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.95)",
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  tierChip: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  tierDot: { width: 6, height: 6, borderRadius: 999 },
  tierLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.2 },

  // ---- Sections ----
  section: { marginTop: 18, paddingHorizontal: 16 },
  sectionLabelRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: colors.mutedForeground,
  },
  bodyText: {
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.foreground,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  lifestyleChip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  lifestyleText: { fontSize: 11, fontWeight: "600", color: colors.foreground },
  snapshotItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  snapshotIcon: {
    width: 16,
    height: 16,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  snapshotText: { fontSize: 12.5, fontWeight: "600", color: colors.foreground, flex: 1 },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    marginTop: 6,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.border,
  },
  factsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  valueCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    width: "48.5%",
  },
  valueCheck: {
    width: 16,
    height: 16,
    borderRadius: 6,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  valueText: { fontSize: 12, fontWeight: "600", color: colors.foreground, flex: 1 },
  factCard: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    width: "48.5%",
  },
  factLabel: {
    fontSize: 9.5,
    fontWeight: "700",
    letterSpacing: 1,
    color: colors.mutedForeground,
  },
  factValue: { marginTop: 2, fontSize: 12, fontWeight: "600", color: colors.foreground },
  actionsRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  passBtn: {
    width: 52,
    height: 52,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  connectBtn: {
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});

void radii;
