import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './src/context/AppContext';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import WorkerHomeScreen from './src/screens/WorkerHomeScreen';
import GigDetailsScreen from './src/screens/GigDetailsScreen';
import RequesterHomeScreen from './src/screens/RequesterHomeScreen';
import RequesterCreateScreen from './src/screens/RequesterCreateScreen';
import RequesterManageGigScreen from './src/screens/RequesterManageGigScreen';
import ChatScreen from './src/screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#ffffff' }
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />

          {/* Worker Flow */}
          <Stack.Screen name="WorkerHome" component={WorkerHomeScreen} />
          <Stack.Screen name="GigDetails" component={GigDetailsScreen} />

          {/* Provider Flow */}
          <Stack.Screen name="RequesterHome" component={RequesterHomeScreen} />
          <Stack.Screen name="RequesterCreate" component={RequesterCreateScreen} />
          <Stack.Screen name="RequesterManageGig" component={RequesterManageGigScreen} />

          {/* Shared */}
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
