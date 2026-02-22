import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

type TabIconProps = {
  focused: boolean;
  activeName: keyof typeof Ionicons.glyphMap;
  inactiveName: keyof typeof Ionicons.glyphMap;
};

function TabIcon({ focused, activeName, inactiveName }: TabIconProps) {
  return (
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons
        name={focused ? activeName : inactiveName}
        size={20}
        color={focused ? "#1f3d5c" : "#4b5563"}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1f3d5c",
        tabBarInactiveTintColor: "#6b7280",
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarStyle: {
          height: 80,
          paddingTop: 8,
          paddingBottom: 14,
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          shadowColor: "#0f172a",
          shadowOpacity: 0.08,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -2 },
          elevation: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeName="home"
              inactiveName="home-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="company"
        options={{
          title: "Company",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeName="business"
              inactiveName="business-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeName="chatbubble-ellipses"
              inactiveName="chatbubble-ellipses-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="payroll"
        options={{
          title: "Payroll",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeName="calendar"
              inactiveName="calendar-outline"
            />
          ),
        }}
      />
      <Tabs.Screen name="projects" options={{ href: null }} />
      <Tabs.Screen
        name="inventory"
        options={{
          title: "Inventory",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeName="cube"
              inactiveName="cube-outline"
            />
          ),
        }}
      />
    </Tabs>
  );
}
