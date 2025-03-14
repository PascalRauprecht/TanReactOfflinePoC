import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ToDoList from '../components/ToDoList';
import { StatusBar } from 'expo-status-bar';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { PagedToDos } from '../types/ToDo';
import { onlineManager, useQueryClient } from '@tanstack/react-query';
import { useCompleteTodo, useReopenTodo, useTodosQuery, useResetTodos } from '../api';
import OfflineSimulator from '../components/OfflineSimulator';

type ToDoListScreenProps = NativeStackScreenProps<RootStackParamList, 'ToDoList'>;

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
            title: 'Tasks',
            headerRight: () => (
                <View style={styles.headerButtonContainer}>
                    <Pressable 
                        style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]} 
                        onPress={handleResetTodos}
                    >
                        <View style={styles.iconWrapper}>
                            <Text style={styles.iconText}>↻</Text>
                        </View>
                        <Text style={styles.buttonLabel}>Reset</Text>
                    </Pressable>
                    <Pressable 
                        style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]} 
                        onPress={() => navigation.navigate('AddToDo')}
                    >
                        <View style={styles.iconWrapper}>
                            <Text style={styles.iconText}>+</Text>
                        </View>
                        <Text style={styles.buttonLabel}>New</Text>
                    </Pressable>
                </View>
            ),
        });
    }, [navigation]);

    const queryClient = useQueryClient();
    const { mutate: completeTodo } = useCompleteTodo(queryClient);
    const { mutate: reopenTodo } = useReopenTodo(queryClient);
    const { mutate: resetTodos } = useResetTodos(queryClient);

    const handleResetTodos = () => resetTodos();

    const handleToggleTodoStatus = (toDoId: string, isCompleted: boolean) => {
        if (isCompleted) {
            reopenTodo(toDoId);
        } else {
            completeTodo(toDoId);
        }
    };

    const { data, isLoading, isError, isSuccess, isFetching } = useTodosQuery();
    const [isOnline, setIsOnline] = useState(onlineManager.isOnline());

    // Monitor network status changes
    useEffect(() => {
        const handleNetworkChange = () => {
            const networkStatus = typeof navigator !== 'undefined' && navigator.onLine;
            setIsOnline(networkStatus);
        };

        // Set initial status
        handleNetworkChange();

        // Add event listeners
        if (typeof window !== 'undefined') {
            window.addEventListener('online', handleNetworkChange);
            window.addEventListener('offline', handleNetworkChange);

            return () => {
                window.removeEventListener('online', handleNetworkChange);
                window.removeEventListener('offline', handleNetworkChange);
            };
        }
    }, []);

    return (
        <View style={styles.container}>
            <OfflineSimulator />
            <View style={styles.list}>
                {!isOnline && data && (
                    <View style={styles.offlineNotice}>
                        <Text style={styles.offlineText}>You are offline.</Text>
                    </View>
                )}
                {isLoading && !data && (
                    <View style={styles.messageContainer}>
                        <ActivityIndicator size="large" color="#0ea5e9" />
                        <Text style={styles.loadingText}>Loading tasks...</Text>
                    </View>
                )}
                {isError && !data && (
                    <View style={styles.messageContainer}>
                        <Text style={styles.errorText}>Failed to load tasks</Text>
                    </View>
                )}
                {data && <ToDoList toDos={data.items} onToggleTodoStatus={handleToggleTodoStatus} />}
                {isFetching && data && (
                    <View style={[styles.loadingOverlay, styles.messageContainer]}>
                        <ActivityIndicator size="small" color="#0ea5e9" />
                    </View>
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
        gap: 12,
        marginRight: 4,
    },
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    list: {
        flex: 1,
    },
    iconButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    iconButtonPressed: {
        opacity: 0.7,
    },
    iconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    iconText: {
        fontSize: 18,
        color: '#64748b',
        fontWeight: '600',
    },
    buttonLabel: {
        fontSize: 10,
        color: '#64748b',
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
    offlineNotice: {
        backgroundColor: '#fef3c7',
        padding: 8,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#fcd34d',
    },
    offlineText: {
        color: '#92400e',
        fontSize: 14,
        fontWeight: '500',
    },
    loadingOverlay: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 8,
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
});
