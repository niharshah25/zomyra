import { Phone } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Logo, Wordmark } from "@/src/components/brand/Logo";
import { toast } from "@/src/components/ui/Toast";
import { colors, radii } from "@/src/theme/colors";

export default function Login() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right", "bottom"]}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.logoRow}>
            <Logo size={36} />
            <Wordmark fontSize={26} />
          </View>
          <Text style={styles.title}>Find a partner who shares your values.</Text>
          <Text style={styles.subtitle}>Meaningful matchmaking for modern Indians.</Text>
        </View>

        <View style={styles.illustrationWrap}>
          <Image
            source={require("../assets/images/login-illustration.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <View style={{ gap: 12 }}>
          <Pressable
            testID="login-continue-phone"
            onPress={() => router.push("/phone")}
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.92 }]}
          >
            <Phone size={20} color={colors.primaryForeground} strokeWidth={2.4} />
            <Text style={styles.primaryBtnText}>Continue with Phone</Text>
          </Pressable>

          <Pressable
            testID="login-continue-google"
            onPress={() => toast.show("Google sign-in coming soon")}
            style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.92 }]}
          >
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.secondaryBtnText}>Continue with Google</Text>
          </Pressable>
        </View>

        <Text style={styles.legal}>
          By continuing, you agree to our <Text style={styles.legalLink}>Terms of Service</Text>{" "}
          and <Text style={styles.legalLink}>Privacy Policy</Text>.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  hero: { alignItems: "center", marginTop: 16 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: {
    marginTop: 18,
    fontSize: 26,
    lineHeight: 31,
    fontWeight: "800",
    color: colors.foreground,
    letterSpacing: -0.4,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: "center",
  },
  illustrationWrap: { alignItems: "center", justifyContent: "center", marginVertical: 12 },
  illustration: { width: 260, height: 196 },
  primaryBtn: {
    height: 56,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 4,
  },
  primaryBtnText: {
    color: colors.primaryForeground,
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryBtn: {
    height: 56,
    borderRadius: radii.lg,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  secondaryBtnText: { fontSize: 16, fontWeight: "700", color: colors.foreground },
  googleG: {
    fontSize: 17,
    fontWeight: "800",
    color: "#EA4335",
    fontStyle: "italic",
  },
  legal: {
    marginTop: 18,
    fontSize: 12,
    lineHeight: 18,
    color: colors.mutedForeground,
    textAlign: "center",
  },
  legalLink: {
    color: colors.foreground,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
