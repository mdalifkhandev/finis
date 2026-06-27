import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AppRole = "admin" | "manager" | "worker" | null | undefined;

type TabItem = {
  label: string;
  route: string;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
  match: (pathname: string) => boolean;
};

const ADMIN_TABS: TabItem[] = [
  {
    label: "Home",
    route: "/(tab)/home",
    activeIcon: "home",
    inactiveIcon: "home-outline",
    match: (pathname) => pathname === "/(tab)/home" || pathname.startsWith("/screens/home"),
  },
  {
    label: "Company",
    route: "/(tab)/company",
    activeIcon: "business",
    inactiveIcon: "business-outline",
    match: (pathname) => pathname === "/(tab)/company" || pathname.startsWith("/screens/company"),
  },
  {
    label: "Chat",
    route: "/(tab)/chat",
    activeIcon: "chatbubble-ellipses",
    inactiveIcon: "chatbubble-ellipses-outline",
    match: (pathname) => pathname === "/(tab)/chat" || pathname.startsWith("/screens/chat"),
  },
  {
    label: "Payroll",
    route: "/(tab)/payroll",
    activeIcon: "calendar",
    inactiveIcon: "calendar-outline",
    match: (pathname) => pathname === "/(tab)/payroll" || pathname.startsWith("/screens/payroll"),
  },
  {
    label: "Inventory",
    route: "/(tab)/inventory",
    activeIcon: "cube",
    inactiveIcon: "cube-outline",
    match: (pathname) => pathname === "/(tab)/inventory" || pathname.startsWith("/screens/inventory"),
  },
];

const WORKER_TABS: TabItem[] = [
  {
    label: "Home",
    route: "/worker/home",
    activeIcon: "home",
    inactiveIcon: "home-outline",
    match: (pathname) => pathname === "/worker/home" || pathname.startsWith("/screens/worker"),
  },
  {
    label: "Tasks",
    route: "/worker/tasks",
    activeIcon: "list",
    inactiveIcon: "list-outline",
    match: (pathname) => pathname === "/worker/tasks",
  },
  {
    label: "Chat",
    route: "/worker/chat",
    activeIcon: "chatbubble-ellipses",
    inactiveIcon: "chatbubble-ellipses-outline",
    match: (pathname) => pathname === "/worker/chat" || pathname.startsWith("/screens/chat"),
  },
  {
    label: "Profile",
    route: "/worker/profile",
    activeIcon: "person",
    inactiveIcon: "person-outline",
    match: (pathname) => pathname === "/worker/profile" || pathname.startsWith("/screens/profile"),
  },
];

const MANAGER_TABS: TabItem[] = [
  {
    label: "Home",
    route: "/manager/home",
    activeIcon: "home",
    inactiveIcon: "home-outline",
    match: (pathname) => pathname === "/manager/home" || pathname.startsWith("/screens/home"),
  },
  {
    label: "Projects",
    route: "/manager/projects",
    activeIcon: "briefcase",
    inactiveIcon: "briefcase-outline",
    match: (pathname) => pathname === "/manager/projects" || pathname.startsWith("/screens/company"),
  },
  {
    label: "Tasks",
    route: "/manager/tasks",
    activeIcon: "checkmark-done",
    inactiveIcon: "checkmark-done-outline",
    match: (pathname) => pathname === "/manager/tasks" || pathname.startsWith("/screens/company/task"),
  },
  {
    label: "Inventory",
    route: "/manager/inventory",
    activeIcon: "cube",
    inactiveIcon: "cube-outline",
    match: (pathname) => pathname === "/manager/inventory" || pathname.startsWith("/screens/inventory"),
  },
  {
    label: "Chat",
    route: "/manager/chat",
    activeIcon: "chatbubble-ellipses",
    inactiveIcon: "chatbubble-ellipses-outline",
    match: (pathname) => pathname === "/manager/chat" || pathname.startsWith("/screens/chat"),
  },
  {
    label: "Quotes",
    route: "/manager/quotes",
    activeIcon: "receipt",
    inactiveIcon: "receipt-outline",
    match: (pathname) => pathname === "/manager/quotes" || pathname.startsWith("/screens/company/projectanalysis"),
  },
];

function getTabsForRole(role?: AppRole) {
  switch (role) {
    case "admin":
      return ADMIN_TABS;
    case "manager":
      return MANAGER_TABS;
    case "worker":
      return WORKER_TABS;
    default:
      return [];
  }
}

export default function RoleTabBar({ role }: { role?: AppRole }) {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const tabs = useMemo(() => getTabsForRole(role), [role]);

  if (tabs.length === 0) {
    return null;
  }

  const activeRoute =
    tabs.find((tab) => tab.match(pathname))?.route ?? tabs[0].route;

  return (
    <View>
      <View
        style={{
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          backgroundColor: "#FFFFFF",
          shadowColor: "#0f172a",
          shadowOpacity: 0.08,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -2 },
          elevation: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            paddingTop: 10,
            paddingBottom: 38,
            paddingHorizontal: 8,
          }}
        >
          {tabs.map((tab) => {
            const focused = tab.route === activeRoute;

            return (
              <Pressable
                key={tab.route}
                onPress={() => router.replace(tab.route as never)}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 54,
                }}
              >
                <Ionicons
                  name={focused ? tab.activeIcon : tab.inactiveIcon}
                  size={20}
                  color={focused ? "#1f3d5c" : "#4b5563"}
                />
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 12,
                    fontWeight: "600",
                    color: focused ? "#1f3d5c" : "#6b7280",
                  }}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
