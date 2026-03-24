import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import car from "../../../assets/images/car.jpg";

const THEME = {
  colors: {
    background: "#F8FAFC",
    white: "#FFFFFF",
    textMain: "#0F172A",
    textSecondary: "#64748B",
    bluePrimary: "#3B82F6",
    greenSuccess: "#10B981",
    orangeWarning: "#F59E0B",
    redError: "#EF4444",
    border: "#F1F5F9",
    cardBg: "#FFFFFF",
  },
};

const TaskDetailsScreen = () => {
  const [inventoryExpanded, setInventoryExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState("");
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);

  const [inventoryItems, setInventoryItems] = useState([
    { id: "1", name: "Cement", quantity: 1, checked: false },
    { id: "2", name: "Steel Rods", quantity: 1, checked: true },
    { id: "3", name: "Steel Rods", quantity: 1, checked: true },
    { id: "4", name: "Steel Rods", quantity: 1, checked: true },
    { id: "5", name: "Safety Helmets", quantity: 1, checked: false },
  ]);

  const toggleInventoryItem = (id: string) => {
    setInventoryItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const updateInventoryQuantity = (id: string, delta: number) => {
    setInventoryItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const filteredInventoryItems = inventoryItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAfterPhoto(result.assets[0].uri);
    }
  };

  const handleComplete = () => {
    const taskData = {
      timestamp: new Date().toISOString(),
      status: "Completed",
      afterPhoto: afterPhoto,
      inventoryUsed: inventoryItems
        .filter((item) => item.checked)
        .map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
        })),
      notes: notes,
    };

    console.log("====================================");
    console.log("SUBMITTING TASK DATA:");
    console.log(JSON.stringify(taskData, null, 2));
    console.log("====================================");

    // You could also add a success toast or navigation here
    alert("Task marked as completed successfully!");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.colors.background }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: 64,
          paddingHorizontal: 20,
          backgroundColor: THEME.colors.white,
          borderBottomWidth: 1,
          borderBottomColor: "#F1F5F9",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", left: 20 }}
        >
          <Feather
            name="chevron-left"
            size={32}
            color={THEME.colors.textMain}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: THEME.colors.textMain,
          }}
        >
          Task
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Task Summary Card */}
        <View
          style={{
            backgroundColor: THEME.colors.white,
            borderRadius: 24,
            padding: 24,
            borderWidth: 1,
            borderColor: THEME.colors.border,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: THEME.colors.textMain,
              marginBottom: 8,
            }}
          >
            Task Details
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: THEME.colors.textSecondary,
              lineHeight: 20,
              marginBottom: 24,
            }}
          >
            Install electrical wiring and outlets for Room 302. Ensure all
            connections meet code requirements.
          </Text>

          {/* Metadata Rows */}
          <View style={{ gap: 16, marginBottom: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 32, alignItems: "center" }}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={THEME.colors.textSecondary}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text
                  style={{ fontSize: 13, color: THEME.colors.textSecondary }}
                >
                  Project
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: THEME.colors.textMain,
                  }}
                >
                  Downtown Plaza
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#FFF7ED",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 100,
                }}
              >
                <Text
                  style={{ color: "#F97316", fontSize: 12, fontWeight: "700" }}
                >
                  In Progress
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 32, alignItems: "center" }}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={THEME.colors.textSecondary}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text
                  style={{ fontSize: 13, color: THEME.colors.textSecondary }}
                >
                  Assigned To
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: THEME.colors.textMain,
                  }}
                >
                  Michael Torres
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 32, alignItems: "center" }}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={THEME.colors.textSecondary}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text
                  style={{ fontSize: 13, color: THEME.colors.textSecondary }}
                >
                  Due Date
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: THEME.colors.textMain,
                  }}
                >
                  Jan 15, 2026
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 32, alignItems: "center" }}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={THEME.colors.textSecondary}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text
                  style={{ fontSize: 13, color: THEME.colors.textSecondary }}
                >
                  Estimated Time
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: THEME.colors.textMain,
                  }}
                >
                  4 hours
                </Text>
              </View>
            </View>
          </View>

          {/* Priority Banner */}
          <View
            style={{
              backgroundColor: "#FEF2F2",
              padding: 16,
              borderRadius: 16,
            }}
          >
            <View
              style={{
                backgroundColor: "#EF4444",
                alignSelf: "flex-start",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <Text style={{ color: "white", fontSize: 13, fontWeight: "700" }}>
                High Priority
              </Text>
            </View>
            <Text style={{ color: "#EF4444", fontSize: 13, fontWeight: "500" }}>
              This task requires immediate attention
            </Text>
          </View>
        </View>

        {/* Before Photo Section */}
        <View
          style={{
            backgroundColor: THEME.colors.white,
            borderRadius: 24,
            padding: 24,
            borderWidth: 1,
            borderColor: THEME.colors.border,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons
              name="camera-outline"
              size={20}
              color={THEME.colors.textMain}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: THEME.colors.textMain,
                marginLeft: 8,
              }}
            >
              Before Photo
            </Text>
          </View>
          <View style={{ borderRadius: 16, overflow: "hidden" }}>
            <Image
              source={car}
              style={{ width: "100%", height: 200 }}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Use Inventory Section */}
        <View
          style={{
            backgroundColor: THEME.colors.white,
            borderRadius: 24,
            padding: 24,
            borderWidth: 1,
            borderColor: THEME.colors.border,
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => setInventoryExpanded(!inventoryExpanded)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: inventoryExpanded ? 16 : 0,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: THEME.colors.textMain,
              }}
            >
              Use Inventory
            </Text>
            <Ionicons
              name={inventoryExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={THEME.colors.textMain}
            />
          </TouchableOpacity>

          {inventoryExpanded && (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#FFFFFF",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#F1F5F9",
                  paddingHorizontal: 12,
                  height: 48,
                  marginBottom: 16,
                }}
              >
                <Ionicons
                  name="search"
                  size={24}
                  color={THEME.colors.textSecondary}
                />
                <TextInput
                  placeholder="Search Item"
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    fontSize: 16,
                    color: "#64748B",
                  }}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <View style={{ gap: 16 }}>
                {filteredInventoryItems.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => toggleInventoryItem(item.id)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          borderWidth: item.checked ? 0 : 2,
                          borderColor: "#CBD5E1",
                          backgroundColor: item.checked
                            ? "#1D4F6D"
                            : "transparent",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.checked && (
                          <Ionicons name="checkmark" size={18} color="white" />
                        )}
                      </TouchableOpacity>
                      <Text
                        style={{
                          marginLeft: 16,
                          fontSize: 18,
                          fontWeight: "500",
                          color: "#475569",
                        }}
                      >
                        {item.name}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#EBF4F6",
                        padding: 4,
                        borderRadius: 12,
                        height: 54,
                        width: 130,
                        justifyContent: "space-between",
                        paddingHorizontal: 6,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => updateInventoryQuantity(item.id, -1)}
                        style={{
                          width: 36,
                          height: 36,
                          backgroundColor: "white",
                          borderRadius: 8,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons
                          name="remove-outline"
                          size={20}
                          color="#0088CC"
                        />
                      </TouchableOpacity>

                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "600",
                          color: "#1D4F6D",
                          marginHorizontal: 12,
                        }}
                      >
                        {item.quantity}
                      </Text>

                      <TouchableOpacity
                        onPress={() => updateInventoryQuantity(item.id, 1)}
                        style={{
                          width: 36,
                          height: 36,
                          backgroundColor: "white",
                          borderRadius: 8,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons
                          name="add-outline"
                          size={20}
                          color="#0088CC"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* After Photo Section */}
        <View
          style={{
            backgroundColor: THEME.colors.white,
            borderRadius: 24,
            padding: 24,
            borderWidth: 1,
            borderColor: THEME.colors.border,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons
              name="camera-outline"
              size={20}
              color={THEME.colors.textMain}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: THEME.colors.textMain,
                marginLeft: 8,
              }}
            >
              After Photo
            </Text>
          </View>

          {afterPhoto ? (
            <View
              style={{ borderRadius: 16, overflow: "hidden", marginBottom: 16 }}
            >
              <Image
                source={{ uri: afterPhoto }}
                style={{ width: "100%", height: 200 }}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => setAfterPhoto(null)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  borderRadius: 15,
                  padding: 5,
                }}
              >
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={pickImage}
              style={{
                width: "100%",
                height: 160,
                borderWidth: 1,
                borderColor: "#E2E8F0",
                borderRadius: 20,
                borderStyle: "dashed",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: "#F0F9FF",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons name="camera" size={24} color="#0088CC" />
              </View>
              <Text
                style={{ fontSize: 15, fontWeight: "700", color: "#334155" }}
              >
                Take or Upload Photo
              </Text>
              <Text style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>
                Photo of completed work
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={pickImage}
            style={{
              height: 48,
              backgroundColor: "#D1F0FF",
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#0F172A", fontSize: 15, fontWeight: "700" }}>
              {afterPhoto ? "Change photo" : "Take photo"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notes Section */}
        <View
          style={{
            backgroundColor: THEME.colors.white,
            borderRadius: 24,
            padding: 24,
            borderWidth: 1,
            borderColor: THEME.colors.border,
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: THEME.colors.textMain,
              marginBottom: 16,
            }}
          >
            Notes (Optional)
          </Text>
          <TextInput
            placeholder="Add any additional notes about this task..."
            multiline
            textAlignVertical="top"
            style={{
              height: 100,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              borderRadius: 16,
              padding: 16,
              fontSize: 14,
              color: THEME.colors.textMain,
            }}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={handleComplete}
          style={{
            height: 56,
            backgroundColor: "#1D4F6D",
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>
            Mark as Completed
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TaskDetailsScreen;
