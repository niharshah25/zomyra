import { UserCircle2 } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FloatingNav } from "@/src/components/nav/FloatingNav";
import { colors } from "@/src/theme/colors";

export default function Profile() {
  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.kicker}>ZOMYRA</Text>
        <Text style={styles.title}>Your profile</Text>
      </View>
      <View style={styles.main}>
        <View style={styles.icon}>
          <UserCircle2 size={32} color={colors.primary} />
        </View>
        <Text style={styles.body}>
          Your profile, settings, and preferences will live here.
        </Text>
      </View>
      <FloatingNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4 },
  kicker: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.6,
    color: colors.mutedForeground,
  },
  title: { marginTop: 2, fontSize: 20, fontWeight: "700", color: colors.foreground, letterSpacing: -0.3 },
  main: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { marginTop: 16, textAlign: "center", fontSize: 14.5, lineHeight: 21, color: colors.mutedForeground, maxWidth: 280 },
});
