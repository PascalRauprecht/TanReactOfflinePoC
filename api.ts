import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { GraphQLClient, gql } from 'graphql-request';
import { REACT_APP_API_URL, REACT_APP_API_KEY } from '@env';
import { AddToDoInput, AddTodoWithIdInput, PagedToDos, ToDo } from './types/ToDo';
import uuid from 'react-native-uuid';

// Ensure API URL has proper protocol
const apiUrl = REACT_APP_API_URL!.startsWith('http') ? REACT_APP_API_URL : `http://${REACT_APP_API_URL}`;

export const graphQLClient = new GraphQLClient(apiUrl, {
    headers: {
        'x-api-key': REACT_APP_API_KEY,
    },
});

type TTodosQuery = {
    todos: PagedToDos;
};

console.log(REACT_APP_API_URL);

export const useTodosQuery = () => {
    return useQuery({
        queryKey: ['todos'],
        queryFn: async () => {
            const { todos } = await graphQLClient.request<TTodosQuery>(gql`
                query {
                    todos {
                        items {
                            id
                            name
                            description
                            completed
                        }
                    }
                }
            `);
            return todos;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        // This is the key setting for offline resilience
        // placeholderData replaces keepPreviousData in v5
        placeholderData: (previousData) => previousData,
        // Continue showing cached data even when a refetch fails
        retryOnMount: false,
    });
};

type TCompleteTodoMutation = {
    completeTodo: ToDo;
};

type TReopenTodoMutation = {
    reopenTodo: ToDo;
};

export const useCompleteTodo = (queryClient: QueryClient) => {
    return useMutation({
        mutationKey: ['completeTodo'],
        mutationFn: completeTodoMutationFn,
        onMutate: async (toDoId) => {
            // In v5, cancelQueries doesn't change much
            await queryClient.cancelQueries({ queryKey: ['todos'] });

            const previousToDos = queryClient.getQueryData<PagedToDos>(['todos']);

            queryClient.setQueryData<PagedToDos>(['todos'], (old) => {
                if (!old) return { items: [] };
                return {
                    items: old.items.map((item) => {
                        if (item.id === toDoId) {
                            return {
                                ...item,
                                completed: true,
                            };
                        } else {
                            return item;
                        }
                    }),
                };
            });

            return { previousToDos };
        },
        onError: (err, newTodo, context) => {
            if (context?.previousToDos) {
                queryClient.setQueryData(['todos'], context.previousToDos);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
};

export const useReopenTodo = (queryClient: QueryClient) => {
    return useMutation({
        mutationKey: ['reopenTodo'],
        mutationFn: reopenTodoMutationFn,
        onMutate: async (toDoId) => {
            await queryClient.cancelQueries({ queryKey: ['todos'] });

            const previousToDos = queryClient.getQueryData<PagedToDos>(['todos']);

            queryClient.setQueryData<PagedToDos>(['todos'], (old) => {
                if (!old) return { items: [] };
                return {
                    items: old.items.map((item) => {
                        if (item.id === toDoId) {
                            return {
                                ...item,
                                completed: false,
                            };
                        } else {
                            return item;
                        }
                    }),
                };
            });

            return { previousToDos };
        },
        onError: (err, newTodo, context) => {
            if (context?.previousToDos) {
                queryClient.setQueryData(['todos'], context.previousToDos);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
};

export const completeTodoMutationFn = async (toDoId: string) => {
    const { completeTodo } = await graphQLClient.request<TCompleteTodoMutation>(
        gql`
            mutation CompleteTodo($toDoId: String!) {
                completeTodo(id: $toDoId) {
                    completed
                    description
                    id
                    name
                }
            }
        `,
        { toDoId }
    );
    return completeTodo;
};

export const reopenTodoMutationFn = async (toDoId: string) => {
    const { reopenTodo } = await graphQLClient.request<TReopenTodoMutation>(
        gql`
            mutation ReopenTodo($toDoId: String!) {
                reopenTodo(id: $toDoId) {
                    completed
                    description
                    id
                    name
                }
            }
        `,
        { toDoId }
    );
    return reopenTodo;
};

type TAddTodoMutation = {
    addTodo: ToDo;
};

export const useAddTodo = (queryClient: QueryClient) => {
    return useMutation({
        mutationFn: async ({ name, description }: AddToDoInput) => {
            const { addTodo } = await graphQLClient.request<TAddTodoMutation>(
                gql`
                    mutation AddTodo($name: String!, $description: String!) {
                        addTodo(newToDo: { name: $name, description: $description }) {
                            completed
                            description
                            id
                            name
                        }
                    }
                `,
                { name, description }
            );
            return addTodo;
        },
        onMutate: async (addedToDo) => {
            await queryClient.cancelQueries({ queryKey: ['todos'] });

            const previousToDos = queryClient.getQueryData<PagedToDos>(['todos']);

            queryClient.setQueryData<PagedToDos>(['todos'], (old) => {
                if (!old) return { items: [] };
                return {
                    items: [
                        ...old.items,
                        {
                            ...addedToDo,
                            completed: false,
                            // random ID that will be overwritten when invalidating
                            id: uuid.v4().toString(),
                        },
                    ],
                };
            });
            return { previousToDos };
        },
        onError: (err, newTodo, context) => {
            if (context?.previousToDos) {
                queryClient.setQueryData(['todos'], context.previousToDos);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
};

type TAddTodoWithIdMutation = {
    addTodoWithId: ToDo;
};

export const useAddTodoWithId = (queryClient: QueryClient) => {
    return useMutation({
        mutationKey: ['addTodoWithId'],
        mutationFn: addTodoWithIdMutationFn,
        onMutate: async (addedToDo) => {
            await queryClient.cancelQueries({ queryKey: ['todos'] });

            const previousToDos = queryClient.getQueryData<PagedToDos>(['todos']);

            queryClient.setQueryData<PagedToDos>(['todos'], (old) => {
                if (!old) return { items: [] };
                return {
                    items: [
                        ...old.items,
                        {
                            ...addedToDo,
                            completed: false,
                        },
                    ],
                };
            });

            return { previousToDos };
        },
        onError: (err, newTodo, context) => {
            if (context?.previousToDos) {
                queryClient.setQueryData(['todos'], context.previousToDos);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
};

type TResetTodosMutation = {
    resetTodos: PagedToDos;
};

type TResetTodosToOpenMutation = {
    resetTodosToOpen: PagedToDos;
};

export const useResetTodos = (queryClient: QueryClient) => {
    return useMutation({
        mutationKey: ['resetTodos'],
        mutationFn: async () => {
            const { resetTodos } = await graphQLClient.request<TResetTodosMutation>(
                gql`
                    mutation ResetTodos {
                        resetTodos {
                            items {
                                id
                                name
                                description
                                completed
                            }
                        }
                    }
                `
            );
            return resetTodos;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['todos'], data);
        },
    });
};

export const useResetTodosToOpen = (queryClient: QueryClient) => {
    return useMutation({
        mutationKey: ['resetTodosToOpen'],
        mutationFn: async () => {
            const { resetTodosToOpen } = await graphQLClient.request<TResetTodosToOpenMutation>(
                gql`
                    mutation ResetTodosToOpen {
                        resetTodosToOpen {
                            items {
                                id
                                name
                                description
                                completed
                            }
                        }
                    }
                `
            );
            return resetTodosToOpen;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['todos'], data);
        },
    });
};

export const addTodoWithIdMutationFn = async ({ id, name, description }: AddTodoWithIdInput) => {
    const { addTodoWithId } = await graphQLClient.request<TAddTodoWithIdMutation>(
        gql`
            mutation AddToDo($id: ID!, $name: String!, $description: String!) {
                addTodoWithId(id: $id, newToDo: { name: $name, description: $description }) {
                    completed
                    description
                    id
                    name
                }
            }
        `,
        { id, name, description }
    );
    return addTodoWithId;
};
