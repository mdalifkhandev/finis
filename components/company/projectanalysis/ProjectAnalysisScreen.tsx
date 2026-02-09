import React, { useState } from "react";
import { View } from "react-native";
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

const initialTasks = [
  {
    id: "task-1",
    title: "Lobby",
    subtitle: "Redesigne -Commerce Dashboard",
    units: "2 Unites",
    date: "Today",
    status: "Completed",
  },
  {
    id: "task-2",
    title: "Second Floor",
    subtitle: "Redesigne -Commerce Dashboard",
    units: "2 Unites",
    date: "today",
    status: "Completed",
  },
  {
    id: "task-3",
    title: "Lobby",
    subtitle: "Analytics Dashboard UI Update",
    units: "2 Unites",
    date: "today",
    status: "Pending",
  },
  {
    id: "task-4",
    title: "Lobby",
    subtitle: "Design System Creation",
    units: "2 Unites",
    date: "today",
    status: "In Progress",
  },
  {
    id: "task-5",
    title: "Lobby",
    subtitle: "Mental Health App",
    units: "2 Unites",
    date: "today",
    status: "Pending",
  },
] satisfies AnalysisTask[];

export default function ProjectAnalysisScreen() {
  const [tasks, setTasks] = useState(initialTasks);

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
          onPressCheck={() => handleToggleTask(task.id)}
        />
      ))}
    </View>
  );
}
