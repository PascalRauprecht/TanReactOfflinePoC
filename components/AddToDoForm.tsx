import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";

interface AddToDoFormProps {
  name: string;
  onChangeName: (name: string) => void;
  description: string;
  onChangeDescription: (name: string) => void;
}

const AddToDoForm = ({
  name,
  onChangeName,
  description,
  onChangeDescription,
}: AddToDoFormProps) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={onChangeName}
          placeholder="Enter task name"
          placeholderTextColor="#94a3b8"
        />
      </View>
      <View>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={onChangeDescription}
          placeholder="Enter task description"
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );
};

export default AddToDoForm;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 6,
    marginHorizontal: 16,
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    fontSize: 14,
    color: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});
