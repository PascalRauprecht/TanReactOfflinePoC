import { StyleSheet, Text, View, Animated, TouchableOpacity, Pressable } from "react-native";
import React, { useRef, useEffect } from "react";
import Checkbox from "expo-checkbox";

import { ToDo } from "../types/ToDo";

interface ToDoItemProps {
  toDo: ToDo;
  onToggleStatus(toDoId: string, isCompleted: boolean): void;
}

const ToDoItem = ({ toDo, onToggleStatus }: ToDoItemProps) => {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const checkboxScaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // Update progress animation when completed status changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: toDo.completed ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [toDo.completed]);

  // Handle press animations
  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        friction: 5,
        tension: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Checkbox animation
  const animateCheckbox = () => {
    Animated.sequence([
      Animated.timing(checkboxScaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(checkboxScaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    onToggleStatus(toDo.id, toDo.completed);
  };

  // Calculate styles based on animations
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const textOpacity = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.6],
  });

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View 
        style={[
          styles.container,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {/* Progress indicator */}
        <Animated.View 
          style={[
            styles.progressBar,
            { width: progressWidth },
            toDo.completed ? styles.completedProgressBar : {}
          ]}
        />
        
        {/* Checkbox with animation */}
        <Animated.View style={{
          transform: [{ scale: checkboxScaleAnim }],
        }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={animateCheckbox}
            style={styles.checkboxContainer}
          >
            <Checkbox
              value={toDo.completed}
              onValueChange={() => animateCheckbox()}
              color={toDo.completed ? "#6366F1" : undefined}
              style={styles.checkbox}
            />
          </TouchableOpacity>
        </Animated.View>
        
        {/* Content */}
        <View style={styles.content}>
          <Animated.Text 
            style={[
              styles.name,
              { 
                opacity: textOpacity,
                textDecorationLine: toDo.completed ? 'line-through' : 'none',
              }
            ]}
            numberOfLines={1}
          >
            {toDo.name}
          </Animated.Text>
          <Animated.Text 
            style={[
              styles.description,
              { opacity: textOpacity }
            ]}
            numberOfLines={2}
          >
            {toDo.description}
          </Animated.Text>
        </View>
        
        {/* Status indicator */}
        <View style={styles.statusIndicator}>
          <View style={[
            styles.statusDot,
            toDo.completed ? styles.completedStatusDot : styles.pendingStatusDot
          ]} />
          <Text style={[
            styles.statusText,
            toDo.completed ? styles.completedStatusText : styles.pendingStatusText
          ]}>
            {toDo.completed ? "Done" : "Todo"}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default ToDoItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#6366F1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  progressBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#EEF2FF",
    zIndex: 0,
  },
  completedProgressBar: {
    backgroundColor: "#EEF2FF",
  },
  checkboxContainer: {
    marginRight: 4,
    borderRadius: 8,
    padding: 2,
  },
  checkbox: {
    borderRadius: 6,
    width: 22,
    height: 22,
    borderColor: "#6366F1",
  },
  content: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 12,
    zIndex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    color: "#1F2937",
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  pendingStatusDot: {
    backgroundColor: "#F59E0B",
  },
  completedStatusDot: {
    backgroundColor: "#10B981",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  pendingStatusText: {
    color: "#F59E0B",
  },
  completedStatusText: {
    color: "#10B981",
  },
});
