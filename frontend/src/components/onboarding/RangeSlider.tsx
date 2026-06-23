/**
 * Range slider (two thumbs). Uses PanResponder + Animated to track each thumb.
 */
import { useRef, useState } from "react";
import {
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "@/src/theme/colors";

type Props = {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  format?: (n: number) => string;
};

const THUMB = 26;

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export default function RangeSlider({ min, max, step = 1, value, onChange, format }: Props) {
  const [width, setWidth] = useState(0);
  const fmt = format ?? ((n: number) => String(n));
  const [lo, hi] = value;
  const valueRef = useRef<[number, number]>(value);
  valueRef.current = value;
  const widthRef = useRef(0);

  const valueToX = (v: number) => ((v - min) / (max - min)) * (width || 1);
  const xToValue = (x: number) => {
    const ratio = clamp(x / (widthRef.current || 1), 0, 1);
    const raw = min + ratio * (max - min);
    return Math.round(raw / step) * step;
  };

  const makePan = (which: "lo" | "hi") =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        const [curLo, curHi] = valueRef.current;
        const startX = valueToX(which === "lo" ? curLo : curHi);
        const next = clamp(xToValue(startX + g.dx), min, max);
        if (which === "lo") {
          const nlo = Math.min(next, curHi - step);
          onChange([nlo, curHi]);
        } else {
          const nhi = Math.max(next, curLo + step);
          onChange([curLo, nhi]);
        }
      },
    });

  const panLo = useRef(makePan("lo")).current;
  const panHi = useRef(makePan("hi")).current;

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setWidth(w);
    widthRef.current = w;
  };

  const xLo = valueToX(lo);
  const xHi = valueToX(hi);

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Range</Text>
        <Text style={styles.value}>
          {fmt(lo)} <Text style={{ color: colors.mutedForeground }}>—</Text> {fmt(hi)}
        </Text>
      </View>
      <View style={styles.trackWrap} onLayout={onLayout}>
        <View style={styles.track} />
        <View
          style={[
            styles.activeTrack,
            { left: xLo, right: Math.max(0, (width || 0) - xHi) },
          ]}
        />
        <View
          {...panLo.panHandlers}
          style={[styles.thumb, { left: xLo - THUMB / 2 }]}
        />
        <View
          {...panHi.panHandlers}
          style={[styles.thumb, { left: xHi - THUMB / 2 }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 8 },
  headerRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.2,
    color: colors.mutedForeground,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.foreground,
  },
  trackWrap: {
    marginTop: 18,
    height: 40,
    justifyContent: "center",
  },
  track: {
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.secondary,
  },
  activeTrack: {
    position: "absolute",
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  thumb: {
    position: "absolute",
    width: THUMB,
    height: THUMB,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
});
