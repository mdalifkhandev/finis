import React, { useState } from "react";
import { View } from "react-native";
import ProjectAnalysisTaskCard from "./ProjectAnalysisTaskCard";

const initialTasks = [
  {
    id: "task-1",
    title: "Lobby",
    subtitle: "Redesigne -Commerce Dashboard",
    units: "2 Unites",
    date: "Today",
    selected: true,
    accentColor: "#5C61F0",
  },
  {
    id: "task-2",
    title: "Second Floor",
    subtitle: "Redesigne -Commerce Dashboard",
    units: "2 Unites",
    date: "today",
    selected: true,
    accentColor: "#5C61F0",
  },
  {
    id: "task-3",
    title: "Lobby",
    subtitle: "Analytics Dashboard UI Update",
    units: "2 Unites",
    date: "today",
    selected: false,
    accentColor: "#F4B501",
  },
  {
    id: "task-4",
    title: "Lobby",
    subtitle: "Design System Creation",
    units: "2 Unites",
    date: "today",
    selected: false,
    accentColor: "#F4B501",
  },
  {
    id: "task-5",
    title: "Lobby",
    subtitle: "Mental Health App",
    units: "2 Unites",
    date: "today",
    selected: false,
    accentColor: "#BFC1C5",
  },
];

export default function ProjectAnalysisScreen() {
  const [tasks, setTasks] = useState(initialTasks);

  const handleToggleTask = (id: string) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, selected: !task.selected } : task
      )
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
          selected={task.selected}
          accentColor={task.accentColor}
          onPressCheck={() => handleToggleTask(task.id)}
        />
      ))}
    </View>
  );
}
