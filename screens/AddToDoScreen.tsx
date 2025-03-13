import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import uuid from "react-native-uuid";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useQueryClient } from "@tanstack/react-query";
import AddToDoForm from "../components/AddToDoForm";
import { useAddTodoWithId } from "../api";

type AddToDoScreenProps = NativeStackScreenProps<RootStackParamList, "AddToDo">;

const AddToDoScreen = ({ navigation }: AddToDoScreenProps) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const queryClient = useQueryClient();
  const { mutate } = useAddTodoWithId(queryClient);

  useEffect(() => {
    navigation.setOptions({
      title: "Add New Task",
      headerRight: () => (
        <Pressable
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.headerButtonPressed
          ]}
          onPress={() => {
            mutate({ id: uuid.v4().toString(), name, description });
            navigation.navigate("ToDoList");
          }}
        >
          <Text style={styles.headerButtonText}>Done</Text>
        </Pressable>
      ),
    });
  }, [navigation, name, description]);

  return (
    <View style={styles.container}>
      <AddToDoForm
        name={name}
        onChangeName={setName}
        description={description}
        onChangeDescription={setDescription}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
});

export default AddToDoScreen;
