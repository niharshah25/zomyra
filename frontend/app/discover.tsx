/**
 * Discover — card-stacked profile feed. Pass/Connect cycles through MOCK_PROFILES.
 * React Query keeps the data swap-able with a real API later.
 */
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FloatingNav } from "@/src/components/nav/FloatingNav";
import { ProfileView } from "@/src/components/discover/ProfileView";
import { discoverService } from "@/src/services/discover";
import { colors } from "@/src/theme/colors";

export default function Discover() {
  const { data: profiles = [] } = useQuery({
    queryKey: ["discover-profiles"],
    queryFn: () => discoverService.list(),
  });
  const [idx, setIdx] = useState(0);

  const advance = () => {
    if (profiles.length === 0) return;
    setIdx((i) => (i + 1) % profiles.length);
  };

  const profile = profiles[idx];

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>DISCOVER</Text>
          <Text style={styles.title}>Today's matches</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        testID="discover-scroll"
      >
        {profile ? (
          <ProfileView profile={profile} onPass={advance} onConnect={advance} />
        ) : (
          <Text style={styles.empty}>Loading…</Text>
        )}
      </ScrollView>

      <FloatingNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  kicker: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
    color: colors.mutedForeground,
  },
  title: { marginTop: 2, fontSize: 16, fontWeight: "700", color: colors.foreground },
  counter: { display: "none" as const },
  counterText: { fontSize: 10.5, fontWeight: "700", color: colors.primary },
  empty: { padding: 32, textAlign: "center", color: colors.mutedForeground },
});
