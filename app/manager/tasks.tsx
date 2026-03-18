import TaskScreen from "@/components/company/task/TaskScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";

export default function ManagerTasksRoute() {
  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <TaskScreen />
      </ScrollView>
    </SafeAreaView>
  );
}
