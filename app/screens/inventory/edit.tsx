import UpdateInventoryScreen from "@/components/inventory/UpdateInventoryScreen";
import { useLocalSearchParams } from "expo-router";

export default function UpdateInventoryRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <UpdateInventoryScreen itemId={id} />;
}
