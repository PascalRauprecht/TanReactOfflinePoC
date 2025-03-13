import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// Initial state
const initialTodos = [
    {
        id: '1',
        name: 'Learn GraphQL',
        description: 'Study GraphQL fundamentals',
        completed: false,
    },
];

// Current todos
let todos = [
    {
        id: '1',
        name: 'Learn GraphQL',
        description: 'Study GraphQL fundamentals',
        completed: false,
    },
];

// GraphQL schema
const typeDefs = `#graphql
  type Todo {
    id: ID!
    name: String!
    description: String
    completed: Boolean!
  }

  type TodoList {
    items: [Todo!]!
  }

  type Query {
    todos: TodoList!
  }

  input AddToDoInput {
    name: String!
    description: String!
  }

  type Mutation {
    addTodo(newToDo: AddToDoInput!): Todo!
    addTodoWithId(id: ID!, newToDo: AddToDoInput!): Todo!
    completeTodo(id: String!): Todo!
    deleteTodo(id: ID!): Boolean!
    resetTodos: TodoList!
  }
`;

// Resolvers
const resolvers = {
    Query: {
        todos: () => ({ items: todos }),
    },
    Mutation: {
        resetTodos: () => {
            todos = [...initialTodos];
            return { items: todos };
        },
        addTodo: (_, { newToDo }) => {
            const todo = {
                id: String(todos.length + 1),
                name: newToDo.name,
                description: newToDo.description,
                completed: false,
            };
            todos.push(todo);
            return todo;
        },
        addTodoWithId: (_, { id, newToDo }) => {
            const todo = {
                id,
                name: newToDo.name,
                description: newToDo.description,
                completed: false,
            };
            todos.push(todo);
            return todo;
        },
        completeTodo: (_, { id }) => {
            const todo = todos.find((t) => t.id === id);
            if (!todo) throw new Error('Todo not found');
            todo.completed = true;
            return todo;
        },
        deleteTodo: (_, { id }) => {
            const initialLength = todos.length;
            todos = todos.filter((t) => t.id !== id);
            return todos.length !== initialLength;
        },
    },
};

// Create and start the server
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀 Server ready at: ${url}`);
