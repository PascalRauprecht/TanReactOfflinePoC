# TanReactOfflinePoC - React Native Todo App

This project consists of a React Native frontend and a GraphQL backend server.

## Quick Start (CodeSandbox)

You can access the deployed version of this application without any local setup:

- Frontend: [https://3jmqt9-19006.csb.app/](https://3jmqt9-19006.csb.app/)
- Backend: [https://3jmqt9-4000.csb.app/](https://3jmqt9-4000.csb.app/)

**Note:** These links might be unavailable if the CodeSandbox instances are not running or have been deactivated.

## Local Development

### Backend Setup

1. Navigate to the server directory:

    ```bash
    cd server
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

The GraphQL server will start running on `http://localhost:4000/graphql`

### Frontend Setup

1. From the root directory, install dependencies:

    ```bash
    npm install
    ```

2. Start the web version:
    ```bash
    npm run web
    ```

The web application will open automatically in your default browser. If it doesn't, you can manually visit `http://localhost:19006`

## Development

-   The backend server uses Apollo Server for GraphQL implementation
-   The frontend is built with React Native and uses Apollo Client for GraphQL queries
-   Hot reloading is enabled for both frontend and backend during development

## Project Structure

```
DSRN/
├── components/       # React Native components
├── screens/         # Screen components
├── server/          # GraphQL server
├── App.tsx          # Main application file
└── api.ts           # API configuration
```

## Offline Support with PersistQueryClientProvider

This application implements offline support using TanStack Query's `PersistQueryClientProvider`. This powerful feature allows the app to work seamlessly even when the network connection is lost.

### How PersistQueryClientProvider Works

The `PersistQueryClientProvider` wraps the entire application and provides a persistent cache layer that works as follows:

1. **Query Persistence**: All queries made through React Query are automatically persisted to AsyncStorage.

```tsx
// From App.tsx
const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 1000,
});

// Wrapping the app with PersistQueryClientProvider
<PersistQueryClientProvider
  client={queryClient}
  persistOptions={{ persister: asyncStoragePersister }}
  onSuccess={() => {
    console.log("PersistQueryClientProvider.onSuccess");
    queryClient
      .resumePausedMutations()
      .then(() => queryClient.invalidateQueries());
  }}
>
  {/* Application components */}
</PersistQueryClientProvider>
```

2. **Mutation Persistence**: When offline, mutations are automatically paused and stored.

3. **Automatic Resumption**: When the app comes back online, paused mutations are automatically resumed.

### Example: Adding a Todo While Offline

When a user adds a new todo while offline:

1. The mutation is executed locally and updates the UI immediately:

```tsx
// From AddToDoScreen.tsx
const { mutate } = useAddTodoWithId(queryClient);

// When user clicks "Done"
mutate({ id: uuid.v4().toString(), name, description });
```

2. Behind the scenes, the mutation is paused and stored in AsyncStorage.

3. When the app comes back online, the `onSuccess` callback in `PersistQueryClientProvider` is triggered:

```tsx
onSuccess={() => {
  console.log("PersistQueryClientProvider.onSuccess");
  queryClient
    .resumePausedMutations()  // Resume all paused mutations
    .then(() => queryClient.invalidateQueries());  // Refresh data
}}
```

4. The paused mutation is executed against the server, and the local cache is updated with the server response.

### Benefits in This Project

- **Seamless User Experience**: Users can continue adding and completing todos even when offline.
- **Data Integrity**: All changes made offline are synchronized when the connection is restored.
- **Optimistic Updates**: The UI updates immediately, providing instant feedback to users.
- **Conflict Resolution**: The system handles conflicts between local and server state.

This implementation makes the Todo app resilient to network issues, providing a native-like experience even in a web environment.
