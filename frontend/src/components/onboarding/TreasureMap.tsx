/**
 * Treasure-map intro screen for onboarding sections. RN-simplified
 * implementation — the original used hand-drawn SVG squiggles; we keep the
 * same 3-node stepper aesthetic with react-native-svg.
 */
import { ArrowLeft, ArrowRight, Anchor, Compass, Heart } from "lucide-react-native";
import type { ComponentType } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { colors, radii } from "@/src/theme/colors";

export type TreasureStepInfo = {
  step: 1 | 2 | 3;
  title: string;
  body: string;
  cta: string;
};

type NodeMeta = {
  label: string;
  Icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  x: number;
  y: number;
};

const NODES: NodeMeta[] = [
  { label: "Plot", Icon: Compass, x: 40, y: 155 },
  { label: "Anchor", Icon: Anchor, x: 150, y: 95 },
  { label: "Love", Icon: Heart, x: 290, y: 55 },
];

const VIEW_W = 320;
const VIEW_H = 200;

function buildPath() {
  const [a, b, c] = NODES;
  const seg1 = `M ${a.x} ${a.y} C ${a.x + 20} ${a.y + 30}, ${b.x - 90} ${b.y + 80}, ${b.x - 30} ${b.y + 20} S ${b.x - 20} ${b.y - 40}, ${b.x} ${b.y}`;
  const seg2 = `M ${b.x} ${b.y} C ${b.x + 30} ${b.y + 60}, ${b.x + 60} ${b.y - 60}, ${b.x + 90} ${b.y - 20} S ${c.x - 10} ${c.y + 50}, ${c.x} ${c.y}`;
  return { seg1, seg2, full: `${seg1} ${seg2}` };
}

export function TreasureMap({
  info,
  onContinue,
  onBack,
}: {
  info: TreasureStepInfo;
  onContinue: () => void;
  onBack?: () => void;
}) {
  const { seg1, seg2, full } = buildPath();

  // Map node position to overlay position (percent of 320x200).
  // We render at fixed width; compute overlay using actual rendered width below.
  const mapWidth = 340;
  const mapHeight = (mapWidth / VIEW_W) * VIEW_H;

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
            hitSlop={8}
          >
            <ArrowLeft size={20} color={colors.foreground} strokeWidth={2.2} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.main}>
        <View style={{ width: mapWidth, height: mapHeight }}>
          <Svg
            width={mapWidth}
            height={mapHeight}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          >
            <Path
              d={full}
              fill="none"
              stroke="rgba(31,18,53,0.25)"
              strokeWidth={2}
              strokeDasharray="2 14"
              strokeLinecap="round"
            />
            {info.step >= 2 ? (
              <Path d={seg1} fill="none" stroke={colors.primary} strokeWidth={2.5} strokeLinecap="round" />
            ) : null}
            {info.step >= 3 ? (
              <Path d={seg2} fill="none" stroke={colors.primary} strokeWidth={2.5} strokeLinecap="round" />
            ) : null}
          </Svg>
          {NODES.map((n, i) => {
            const stepNum = (i + 1) as 1 | 2 | 3;
            const state =
              stepNum < info.step ? "done" : stepNum === info.step ? "active" : "locked";
            const left = (n.x / VIEW_W) * mapWidth - 20;
            const top = (n.y / VIEW_H) * mapHeight - 20;
            return (
              <View key={n.label} style={[styles.nodeWrap, { left, top }]}>
                <View
                  style={[
                    styles.nodeDot,
                    state === "active" && {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    },
                    state === "done" && {
                      backgroundColor: "rgba(91,44,111,0.15)",
                      borderColor: colors.primary,
                    },
                    state === "locked" && {
                      backgroundColor: colors.background,
                      borderColor: "rgba(31,18,53,0.20)",
                    },
                  ]}
                >
                  <n.Icon
                    size={18}
                    color={state === "active" ? "#fff" : state === "done" ? colors.primary : "rgba(31,18,53,0.4)"}
                    strokeWidth={2.2}
                  />
                </View>
                <Text
                  style={[
                    styles.nodeLabel,
                    state === "locked" && { color: "rgba(31,18,53,0.35)" },
                  ]}
                >
                  {n.label}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={{ marginTop: 36, alignItems: "center", maxWidth: 340 }}>
          <Text style={styles.stepLabel}>STEP {info.step} OF 3</Text>
          <Text style={styles.title}>{info.title}</Text>
          <Text style={styles.body}>{info.body}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          testID="treasure-continue"
          onPress={onContinue}
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.92 }]}
        >
          <Text style={styles.ctaText}>{info.cta}</Text>
          <ArrowRight size={16} color={colors.primaryForeground} strokeWidth={2.4} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 16, paddingTop: 8 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -8,
  },
  main: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeWrap: {
    position: "absolute",
    alignItems: "center",
    width: 40,
  },
  nodeDot: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeLabel: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.4,
    color: "rgba(31,18,53,0.75)",
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
    color: colors.primary,
  },
  title: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "700",
    color: colors.foreground,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  body: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
    color: colors.mutedForeground,
    textAlign: "center",
  },
  footer: { paddingHorizontal: 24, paddingBottom: 24 },
  cta: {
    height: 52,
    borderRadius: radii.md + 1,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  ctaText: {
    color: colors.primaryForeground,
    fontSize: 15,
    fontWeight: "700",
  },
});
