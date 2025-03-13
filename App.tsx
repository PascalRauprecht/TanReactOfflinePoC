import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { addTodoWithIdMutationFn, completeTodoMutationFn } from './api';
import AddToDoScreen from './screens/AddToDoScreen';
import ToDoListScreen from './screens/ToDoListScreen';
import { RootStackParamList } from './types/navigation';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 hours (renamed from cacheTime in v5)
            staleTime: 2000,
            retry: 0,
            // These settings help with offline resilience
            refetchOnMount: true,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            // This is critical - it tells React Query to use cached data even when stale
            // when the network is unavailable
            networkMode: 'always',
        },
    },
});

// In v5, mutation defaults are set differently
const addTodoWithIdMutation = {
    mutationKey: ['addTodoWithId'],
    mutationFn: ({ id, name, description }: { id: string, name: string, description: string }) => {
        return addTodoWithIdMutationFn({ id, name, description });
    },
};

const completeTodoMutation = {
    mutationKey: ['completeTodo'],
    mutationFn: (id: string) => {
        return completeTodoMutationFn(id);
    },
};

const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
    throttleTime: 1000,
});

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}
            onSuccess={() => {
                console.log('PersistQueryClientProvider.onSuccess');
                // In v5, resumePausedMutations and invalidateQueries have changed
                queryClient.resumePausedMutations().then(() => queryClient.invalidateQueries());
            }}
        >
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        contentStyle: {
                            backgroundColor: '#ffffff',
                        },
                    }}
                >
                    <Stack.Screen name="ToDoList" component={ToDoListScreen} />
                    <Stack.Screen name="AddToDo" component={AddToDoScreen} />
                </Stack.Navigator>
                <ReactQueryDevtools initialIsOpen={false} />
            </NavigationContainer>
        </PersistQueryClientProvider>
    );
}
