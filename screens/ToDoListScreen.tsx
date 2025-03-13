import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import ToDoList from "../components/ToDoList";
import { StatusBar } from "expo-status-bar";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { PagedToDos } from "../types/ToDo";
import { onlineManager, useQueryClient } from "@tanstack/react-query";
import { useCompleteTodo, useTodosQuery, useResetTodos } from "../api";
import OfflineSimulator from "../components/OfflineSimulator";

type ToDoListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ToDoList"
>;

const ToDoListScreen = ({ navigation }: ToDoListScreenProps) => {
  // const data = useMemo<PagedToDos>(
  //   () => ({
  //     items: [
  //       {
  //         id: "1",
  //         name: "ToDo 1",
  //         description:
  //           "ToDo 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at varius diam",
  //         completed: false,
  //       },
  //       {
  //         id: "2",
  //         name: "ToDo 2",
  //         description:
  //           "ToDo 2: Aliquam a mattis sapien. Nullam pretium imperdiet nulla sit amet scelerisque",
  //         completed: false,
  //       },
  //       {
  //         id: "3",
  //         name: "ToDo 3",
  //         description:
  //           "ToDo 3: Proin viverra cursus diam, quis cursus nunc gravida sed.",
  //         completed: false,
  //       },
  //     ],
  //   }),
  //   []
  // );
  //const [isOnline, setIsOnline] = useState(onlineManager.isOnline());
  useEffect(() => {
    navigation.setOptions({
      title: "Tasks",
      headerRight: () => (
        <View style={styles.headerButtonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.headerButton,
              styles.resetButton,
              pressed && styles.headerButtonPressed
            ]}
            onPress={handleResetTodos}
          >
            <Text style={styles.headerButtonText}>Reset</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.headerButtonPressed
            ]}
            onPress={() => navigation.navigate("AddToDo")}
          >
            <Text style={styles.headerButtonText}>Add New</Text>
          </Pressable>
        </View>
      ),
    });
  }, [navigation]);

  const queryClient = useQueryClient();
  const { mutate } = useCompleteTodo(queryClient);
  const { mutate: resetTodos } = useResetTodos(queryClient);

  const handleResetTodos = () => resetTodos();

  const handleCompleteToDo = (toDoId: string) => mutate(toDoId);

  const { data, isLoading, isError, isSuccess } = useTodosQuery();

  return (
    <View style={styles.container}>
      <OfflineSimulator />
      <View style={styles.list}>
        {isError && (
          <View style={styles.messageContainer}>
            <Text style={styles.errorText}>Failed to load tasks</Text>
          </View>
        )}
        {isLoading && (
          <View style={styles.messageContainer}>
            <ActivityIndicator size="large" color="#0ea5e9" />
            <Text style={styles.loadingText}>Loading tasks...</Text>
          </View>
        )}
        {isSuccess && (
          <ToDoList toDos={data.items} onCompleteToDo={handleCompleteToDo} />
        )}
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

export default ToDoListScreen;

const styles = StyleSheet.create({
  headerButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resetButton: {
    backgroundColor: '#64748b',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  list: {
    flex: 1,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#0ea5e9',
    marginRight: 8,
  },
  headerButtonPressed: {
    backgroundColor: '#0284c7',
  },
  headerButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '500',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
});
