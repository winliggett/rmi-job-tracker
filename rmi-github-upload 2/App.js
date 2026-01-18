import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { UserProvider, useUser } from './contexts/UserContext';
import DashboardScreen from './screens/DashboardScreen';
import JobDetailsScreen from './screens/JobDetailsScreen';
import CreateJobScreen from './screens/CreateJobScreen';
import LoginScreen from './screens/LoginScreen';
import SettingsScreen from './screens/SettingsScreen';
import { colors, typography } from './utils/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTintColor: colors.primary,
  headerTitleStyle: {
    ...typography.headline,
    color: colors.text,
    fontWeight: '600',
  },
  headerShadowVisible: false,
  headerBackTitleVisible: false,
  contentStyle: {
    backgroundColor: colors.background,
  },
};

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="DashboardHome"
        component={DashboardScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="JobDetails"
        component={JobDetailsScreen}
        options={{
          title: 'Job Details',
        }}
      />
      <Stack.Screen
        name="CreateJob"
        component={CreateJobScreen}
        options={{
          title: 'New Job',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="SettingsHome"
        component={SettingsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function TabIcon({ name, focused }) {
  const iconStyle = {
    fontSize: 24,
    color: focused ? colors.primary : colors.textTertiary,
  };
  const icons = {
    Dashboard: '📋',
    Settings: '⚙️',
  };
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', minWidth: 48, minHeight: 48 }}>
      <Text style={iconStyle}>{icons[name] || '📋'}</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.backgroundSecondary,
          borderTopColor: colors.borderLight,
          paddingTop: 8,
          paddingBottom: 8,
          height: 84,
        },
        tabBarLabelStyle: {
          ...typography.caption1,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarLabel: 'Jobs',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoEmoji}>🏗️</Text>
        <Text style={styles.appName}>RMI Job Tracker</Text>
      </View>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

function AppNavigator() {
  const { user, isLoading, login } = useUser();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Login">
          {props => <LoginScreen {...props} onLogin={login} />}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Main" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <UserProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <AppNavigator />
          </NavigationContainer>
        </UserProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  appName: {
    ...typography.title1,
    color: colors.text,
    fontWeight: '700',
  },
  loadingText: {
    marginTop: 16,
    ...typography.body,
    color: colors.textTertiary,
  },
});
