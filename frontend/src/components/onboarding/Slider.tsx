/**
 * Single-thumb slider (used for height & 1..5 scale slider).
 */
import { useRef, useState } from "react";
import {
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";

import { colors } from "@/src/theme/colors";

type Props = {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (n: number) => void;
};

const THUMB = 28;

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function Slider({ min, max, step = 1, value, onChange }: Props) {
  const [width, setWidth] = useState(0);
  const valueRef = useRef(value);
  valueRef.current = value;
  const widthRef = useRef(0);

  const valueToX = (v: number) => ((v - min) / (max - min)) * (width || 1);
  const xToValue = (x: number) => {
    const ratio = clamp(x / (widthRef.current || 1), 0, 1);
    const raw = min + ratio * (max - min);
    return Math.round(raw / step) * step;
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const x = e.nativeEvent.locationX;
        onChange(clamp(xToValue(x), min, max));
      },
      onPanResponderMove: (_, g) => {
        const startX = valueToX(valueRef.current);
        const next = clamp(xToValue(startX + g.dx), min, max);
        onChange(next);
      },
    }),
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setWidth(w);
    widthRef.current = w;
  };

  const x = valueToX(value);

  return (
    <View style={styles.trackWrap} onLayout={onLayout} {...pan.panHandlers}>
      <View style={styles.track} />
      <View style={[styles.activeTrack, { width: x }]} />
      <View style={[styles.thumb, { left: x - THUMB / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  trackWrap: {
    height: 44,
    justifyContent: "center",
  },
  track: {
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.secondary,
  },
  activeTrack: {
    position: "absolute",
    left: 0,
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
