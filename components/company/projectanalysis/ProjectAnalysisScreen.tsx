import { useProjectAnalysisQuery } from "@/hooks/company/company";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import ProjectAnalysisTaskCard from "./ProjectAnalysisTaskCard";

type AnalysisTaskStatus =
  | "Completed"
  | "Pending"
  | "Not Started"
  | "In Progress";

type AnalysisTask = {
  id: string;
  title: string;
  subtitle: string;
  units: string;
  date: string;
  status: AnalysisTaskStatus;
};

type ProjectAnalysisScreenProps = {
  projectId?: string;
};

function mapStatus(status: string): AnalysisTaskStatus {
  const norm = status.toLowerCase();
  if (norm === "completed") return "Completed";
  if (norm === "in_progress") return "In Progress";
  if (norm === "pending") return "Pending";
  return "Not Started";
}

export default function ProjectAnalysisScreen({
  projectId,
}: ProjectAnalysisScreenProps) {
  const { data, isLoading } = useProjectAnalysisQuery(projectId);
  const [tasks, setTasks] = useState<AnalysisTask[]>([]);

  useEffect(() => {
    if (data?.checklist) {
      const mappedTasks = data.checklist.map((item) => ({
        id: item.floorId,
        title: item.floorName,
        subtitle: item.tasks.map((t) => t.taskName).join(", ") || "No tasks",
        units: `${item.tasks.length} Tasks`,
        date: "Today",
        status: mapStatus(item.floorStatus),
      }));
      setTasks(mappedTasks);
    }
  }, [data]);

  const handleToggleTask = (id: string) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "Completed" ? "Pending" : "Completed",
            }
          : task,
      ),
    );
  };

  if (isLoading) {
    return (
      <View className="mt-10 items-center justify-center">
        <ActivityIndicator size="large" color="#1F506D" />
      </View>
    );
  }

  return (
    <View className="mt-6 px-5">
      {tasks.map((task) => (
        <ProjectAnalysisTaskCard
          key={task.id}
          title={task.title}
          subtitle={task.subtitle}
          units={task.units}
          date={task.date}
          status={task.status}
        />
      ))}
    </View>
  );
}
