/**
 * Floating bottom nav rendered on every tab screen. Mimics web FloatingNav.tsx
 * but uses expo-router. Sits in a tab layout — visible on profile/discover/requests/chats.
 */
import { Compass, MessageCircle, User, UserPlus } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";

import { colors } from "@/src/theme/colors";
import { useRequestsStore } from "@/src/stores/requests-store";

type Item = { key: "profile" | "discover" | "requests" | "chats"; label: string; path: string };

const ITEMS: Item[] = [
  { key: "profile", label: "Profile", path: "/profile" },
  { key: "discover", label: "Discover", path: "/discover" },
  { key: "requests", label: "Requests", path: "/requests" },
  { key: "chats", label: "Chats", path: "/chats" },
];

export function FloatingNav() {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const insets = useSafeAreaInsets();
  const requestCount = useRequestsStore((s) => s.requests.length);
  const badgeText = requestCount > 99 ? "99+" : String(requestCount);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.host, { paddingBottom: insets.bottom + 8 }]}
    >
      <View style={styles.bar}>
        {ITEMS.map((item) => {
          const active = isActive(item.path);
          const color = active ? colors.primary : colors.mutedForeground;
          return (
            <Pressable
              key={item.key}
              testID={`tab-${item.key}`}
              onPress={() => router.push(item.path as never)}
              style={styles.item}
            >
              <View style={styles.iconWrap}>
                {item.key === "profile" ? (
                  <View style={[styles.profileDot, { borderColor: active ? colors.primary : colors.border }]}>
                    <User size={11} color={color} strokeWidth={active ? 2.4 : 1.9} />
                  </View>
                ) : item.key === "discover" ? (
                  <Compass size={18} color={color} strokeWidth={active ? 2.4 : 1.9} />
                ) : item.key === "requests" ? (
                  <View>
                    <UserPlus size={18} color={color} strokeWidth={active ? 2.4 : 1.9} />
                    {requestCount > 0 ? (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{badgeText}</Text>
                      </View>
                    ) : null}
                  </View>
                ) : (
                  <MessageCircle size={18} color={color} strokeWidth={active ? 2.4 : 1.9} />
                )}
              </View>
              <Text style={[styles.label, { color }]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  bar: {
    width: "100%",
    maxWidth: 360,
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: "rgba(232,225,239,0.6)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 4,
  },
  iconWrap: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  profileDot: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
  },
  badge: {
    position: "absolute",
    top: -8,
    left: "50%",
    transform: [{ translateX: -8 }],
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 999,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.card,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "700",
  },
});
