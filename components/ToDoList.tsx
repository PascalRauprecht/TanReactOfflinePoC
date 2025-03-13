import { FlatList, View, StyleSheet } from "react-native";
import React from "react";
import { ToDo } from "../types/ToDo";
import ToDoItem from "./ToDoItem";

interface ToDoListProps {
  toDos: ToDo[];
  onToggleTodoStatus: (toDoId: string, isCompleted: boolean) => void;
}

const ToDoList = ({ toDos, onToggleTodoStatus }: ToDoListProps) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={toDos}
        renderItem={({ item }) => (
          <ToDoItem toDo={item} onToggleStatus={onToggleTodoStatus} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContent: {
    paddingVertical: 8,
  },
});

export default ToDoList;
