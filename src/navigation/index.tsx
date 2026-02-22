import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { DashboardScreen } from '../screens/DashboardScreen';
import { PlannerScreen } from '../screens/PlannerScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { WorkoutDetailScreen } from '../screens/WorkoutDetailScreen';
import { ActiveWorkoutScreen } from '../screens/ActiveWorkoutScreen';
import { WorkoutCompleteScreen } from '../screens/WorkoutCompleteScreen';
import { SessionDetailScreen } from '../screens/SessionDetailScreen';
import { CreatePlanScreen } from '../screens/CreatePlanScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ name, focused, color, size }: { name: string; focused: boolean; color: string; size: number }) {
  const scale = useSharedValue(1);
  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.12 : 1, { damping: 12, stiffness: 300 });
  }, [focused]);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={animStyle}>
      <Ionicons name={(focused ? name : `${name}-outline`) as any} size={size} color={color} />
    </Animated.View>
  );
}

function MainTabs() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const tabs = [
    { name: 'Dashboard', label: 'Home', icon: 'home' },
    { name: 'Planner', label: 'Plans', icon: 'barbell' },
    { name: 'History', label: 'History', icon: 'time' },
    { name: 'Progress', label: 'Progress', icon: 'trending-up' },
    { name: 'Settings', label: 'Settings', icon: 'settings-sharp' },
  ];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const tab = tabs.find(t => t.name === route.name);
        return {
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.tabBarBorder,
            borderTopWidth: StyleSheet.hairlineWidth,
            paddingBottom: insets.bottom > 0 ? 0 : 8,
            height: 60 + (insets.bottom > 0 ? insets.bottom : 8),
          },
          tabBarLabelStyle: { fontSize: 10, fontWeight: '500', marginTop: -2 },
          tabBarIcon: ({ focused, color, size }) =>
            tab ? <TabIcon name={tab.icon} focused={focused} color={color} size={size} /> : null,
        };
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Planner" component={PlannerScreen} options={{ tabBarLabel: 'Plans' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarLabel: 'History' }} />
      <Tab.Screen name="Progress" component={ProgressScreen} options={{ tabBarLabel: 'Progress' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Settings' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { colors } = useTheme();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'ios' ? 'default' : 'fade_from_bottom',
        contentStyle: { backgroundColor: colors.bg },
      }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
        <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
        <Stack.Screen name="WorkoutComplete" component={WorkoutCompleteScreen} options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="SessionDetail" component={SessionDetailScreen} />
        <Stack.Screen name="CreatePlan" component={CreatePlanScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}