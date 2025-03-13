import { FlatList, View, StyleSheet } from "react-native";
import React from "react";
import { ToDo } from "../types/ToDo";
import ToDoItem from "./ToDoItem";

interface ToDoListProps {
  toDos: ToDo[];
  onCompleteToDo: (toDoId: string) => void;
}

const ToDoList = ({ toDos, onCompleteToDo }: ToDoListProps) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={toDos}
        renderItem={({ item }) => (
          <ToDoItem toDo={item} onComplete={onCompleteToDo} />
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
