# DSRN - React Native Todo App

This project consists of a React Native frontend and a GraphQL backend server.

## Backend Setup

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

## Frontend Setup

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

- The backend server uses Apollo Server for GraphQL implementation
- The frontend is built with React Native and uses Apollo Client for GraphQL queries
- Hot reloading is enabled for both frontend and backend during development

## Project Structure

```
DSRN/
├── components/       # React Native components
├── screens/         # Screen components
├── server/          # GraphQL server
├── App.tsx          # Main application file
└── api.ts           # API configuration
```
