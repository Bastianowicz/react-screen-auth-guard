# react-native-auth-guard

A flexible and type-safe authentication guard for React Native apps using React Navigation and TypeScript.

## Overview

`react-native-auth-guard` provides an easy way to enforce authentication requirements on screens within a React (Native) app. By wrapping components with a higher-order component (HOC), you can automatically redirect users based on their authentication status.

## Features

- **Type-safe**: Built with TypeScript, ensuring reliable, predictable behavior.
- **Flexible authentication**: Supports both authenticated-only and unauthenticated-only screens.
- **Easy integration**: Designed to work seamlessly with React Navigation.

## Installation

Install the package using npm or yarn:

```bash
npm install react-native-auth-guard
# or
yarn add react-native-auth-guard
```

### Peer Dependencies

Ensure you have the following dependencies installed:

- `react`
- `@react-navigation/native`

## Usage

### Step 1: Wrap Your App with `AuthConfigProvider`

The `AuthConfigProvider` should be set up at the root level of your app. Configure it with:
- `getAuthState`: A function returning a boolean indicating the current authentication state.
- `unauthenticatedAction`: A function to execute when an unauthenticated user tries to access an authenticated-only screen.
- `authenticatedAction`: A function to execute when an authenticated user tries to access an unauthenticated-only screen.

```typescript jsx
import React from 'react';
import { AuthConfigProvider } from 'react-native-auth-guard';
import AppNavigator from './AppNavigator';
import { getAuthState } from './authState';

const App = () => (
  <AuthConfigProvider
    getAuthState={getAuthState}
    unauthenticatedAction={() => {
      // Define your unauthenticated action, e.g., navigate to the Login screen
    }}
    authenticatedAction={() => {
      // Define your authenticated action, e.g., navigate to the Home screen
    }}
  >
    <AppNavigator />
  </AuthConfigProvider>
);

export default App;
```

### Step 2: Define Your Authentication State Logic

Define your authentication state and actions in `authState.ts` (or any relevant file):

```typescript
let isAuthenticated = false;

export const getAuthState = () => isAuthenticated;

export const login = () => {
  isAuthenticated = true;
};

export const logout = () => {
  isAuthenticated = false;
};
```

### Step 3: Use `withAuthGuard` in Navigator Stack Definitions

Apply the `withAuthGuard` HOC to enforce authentication requirements directly within your navigation stack definitions:

```typescript jsx
// AppNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { withAuthGuard, AuthRequirement } from 'react-native-auth-guard';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={withAuthGuard(HomeScreen, {
        authRequirement: AuthRequirement.Authenticated,
      })}
    />
    <Stack.Screen
      name="Login"
      component={withAuthGuard(LoginScreen, {
        authRequirement: AuthRequirement.Unauthenticated,
      })}
    />
    {/* Add other screens as needed */}
  </Stack.Navigator>
);

export default AppNavigator;
```

By defining `withAuthGuard` directly in the navigator stack, you ensure that authentication requirements are applied consistently when navigating between screens.

### Alternative: Use `withAuthGuard` Directly in Screen Files

If you prefer, you can also use `withAuthGuard` within individual screen files, wrapping the component before exporting it.

```typescript jsx
// HomeScreen.tsx

import React from 'react';
import { View, Text } from 'react-native';
import { withAuthGuard, AuthRequirement } from 'react-native-auth-guard';

const HomeScreen: React.FC = () => (
    <View>
        <Text>Welcome to the Home Screen!</Text>
</View>
);

export default withAuthGuard(HomeScreen, {
    authRequirement: AuthRequirement.Authenticated,
});
```

## API

### `AuthConfigProvider`

This context provider requires:
- **`getAuthState`**: A function returning a boolean indicating authentication status.
- **`unauthenticatedAction`**: A function executed when an unauthenticated user attempts to access an authenticated-only screen.
- **`authenticatedAction`**: A function executed when an authenticated user attempts to access an unauthenticated-only screen.

### `withAuthGuard`

A higher-order component for protecting screens with authentication requirements.

**Options**:
- **`authRequirement`**: One of `AuthRequirement.Authenticated` or `AuthRequirement.Unauthenticated`.

### `AuthRequirement`

An enum defining the authentication requirements:
- **Authenticated**: The screen is accessible only to authenticated users.
- **Unauthenticated**: The screen is accessible only to unauthenticated users.

## Limitations

### Limited Granular Control:
Applying withAuthGuard directly in the navigator or screen file enforces a fixed authentication requirement. Adjusting requirements dynamically based on changing app conditions (e.g., role-based access) is more challenging.

### Redirection Timing:
Redirects are triggered based on the authRequirement, but there may be slight delays in asynchronous authentication checks (e.g., when the auth state relies on API calls or async storage). This can cause flickers where a screen briefly displays before redirecting.

### Lack of Deep Navigation Awareness:
When navigating deeply within nested stacks or tab navigators, the withAuthGuard may not always account for the full navigation context. It’s designed for single-level navigation, so nested navigator overrides aren’t supported in this basic setup.

### Global State Dependence:
Since it relies on a global AuthConfigProvider context, any issues with the context provider (e.g., missing or unmounted context) could prevent authentication requirements from applying, especially if the context isn’t correctly propagated in large, multi-screen apps.

### Initial Render Handling:
Without preloading the auth state, unauthenticated screens can briefly render before unauthenticatedAction redirects, leading to UX issues.

## Testing

The library includes Jest test cases to verify the correct behavior of the HOC and context under various conditions. Run tests with:

```bash
npm test
```

## Example

The `example` directory contains a sample project demonstrating usage of `react-native-auth-guard`.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
