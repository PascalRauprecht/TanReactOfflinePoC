import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Checkbox from "expo-checkbox";

import { ToDo } from "../types/ToDo";

interface ToDoItemProps {
  toDo: ToDo;
  onToggleStatus(toDoId: string, isCompleted: boolean): void;
}

const ToDoItem = ({ toDo, onToggleStatus }: ToDoItemProps) => {
  return (
    <View style={[styles.container, toDo.completed && { opacity: 0.7 }]}>
      <Checkbox
        value={toDo.completed}
        onValueChange={() => onToggleStatus(toDo.id, toDo.completed)}
        color={toDo.completed ? "#4CAF50" : undefined}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{toDo.name}</Text>
        <Text style={styles.description}>{toDo.description}</Text>
      </View>
    </View>
  );
};

export default ToDoItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  content: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#1a1a1a",
  },
  description: {
    fontSize: 14,
    color: "#666666",
  },
});
