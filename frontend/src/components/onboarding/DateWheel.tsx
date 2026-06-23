/**
 * Lightweight RN date picker — three wheel-like columns (Day / Month / Year).
 * Implemented via three ScrollViews with snap and a centered selection band,
 * mirroring the web Wheel.tsx behavior but with native ScrollView snapping.
 */
import { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "@/src/theme/colors";

const ITEM_H = 40;
const VISIBLE = 5;

function Wheel({
  values,
  selectedIndex,
  onChange,
  width,
}: {
  values: (string | number)[];
  selectedIndex: number;
  onChange: (i: number) => void;
  width: number;
}) {
  const ref = useRef<ScrollView>(null);
  const lastEmitted = useRef(selectedIndex);

  useEffect(() => {
    if (selectedIndex === lastEmitted.current) return;
    ref.current?.scrollTo({ y: selectedIndex * ITEM_H, animated: true });
    lastEmitted.current = selectedIndex;
  }, [selectedIndex]);

  return (
    <View style={[styles.wheelWrap, { width, height: ITEM_H * VISIBLE }]}>
      <View pointerEvents="none" style={styles.band} />
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        contentOffset={{ x: 0, y: selectedIndex * ITEM_H }}
        onMomentumScrollEnd={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          const i = Math.round(y / ITEM_H);
          const clamped = Math.max(0, Math.min(values.length - 1, i));
          if (clamped !== lastEmitted.current) {
            lastEmitted.current = clamped;
            onChange(clamped);
          }
        }}
      >
        <View style={{ height: ITEM_H * Math.floor(VISIBLE / 2) }} />
        {values.map((v, i) => (
          <View
            key={`${String(v)}-${i}`}
            style={[styles.item, { height: ITEM_H }]}
          >
            <Text
              style={[
                styles.itemText,
                i === selectedIndex && styles.itemTextActive,
              ]}
            >
              {String(v)}
            </Text>
          </View>
        ))}
        <View style={{ height: ITEM_H * Math.floor(VISIBLE / 2) }} />
      </ScrollView>
    </View>
  );
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const NOW = new Date();
const MAX_YEAR = NOW.getFullYear() - 18;
const MIN_YEAR = NOW.getFullYear() - 80;
const YEARS = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MAX_YEAR - i);

function daysIn(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

export function calcAge(iso: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const today = new Date();
  let age = today.getFullYear() - y;
  const mDiff = today.getMonth() + 1 - m;
  if (mDiff < 0 || (mDiff === 0 && today.getDate() < d)) age--;
  return age;
}

function parse(iso: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [y, m, d] = iso.split("-").map(Number);
    return { day: d, month: m, year: y };
  }
  return { day: 1, month: 1, year: MAX_YEAR - 7 };
}

function format(day: number, month: number, year: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function DateWheel({
  value,
  onChange,
}: {
  value: string;
  onChange: (iso: string) => void;
}) {
  const { day, month, year } = parse(value);
  const days = Array.from({ length: daysIn(month, year) }, (_, i) => i + 1);
  const yearIdx = YEARS.indexOf(year);

  const setPart = (part: "d" | "m" | "y", v: number) => {
    let nd = day, nm = month, ny = year;
    if (part === "d") nd = v;
    if (part === "m") nm = v;
    if (part === "y") ny = v;
    const max = daysIn(nm, ny);
    if (nd > max) nd = max;
    onChange(format(nd, nm, ny));
  };

  return (
    <View style={styles.row}>
      <Wheel
        values={days}
        selectedIndex={day - 1}
        onChange={(i) => setPart("d", days[i])}
        width={72}
      />
      <Wheel
        values={MONTHS}
        selectedIndex={month - 1}
        onChange={(i) => setPart("m", i + 1)}
        width={84}
      />
      <Wheel
        values={YEARS}
        selectedIndex={yearIdx >= 0 ? yearIdx : 0}
        onChange={(i) => setPart("y", YEARS[i])}
        width={96}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "center", gap: 10 },
  wheelWrap: {
    position: "relative",
  },
  band: {
    position: "absolute",
    left: 0,
    right: 0,
    top: ITEM_H * Math.floor(VISIBLE / 2),
    height: ITEM_H,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(91,44,111,0.25)",
    backgroundColor: "rgba(91,44,111,0.05)",
    borderRadius: 12,
    zIndex: 1,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 16,
    color: "rgba(122,107,137,0.6)",
  },
  itemTextActive: {
    color: colors.foreground,
    fontWeight: "700",
  },
});
