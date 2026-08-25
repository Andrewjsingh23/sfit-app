import React, { useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import { useApp } from "../context/AppContext";
import { colors } from "../theme";
import { Exercise, UserProfile, WorkoutDay } from "../types";

import AuthScreen from "../screens/AuthScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import HomeScreen from "../screens/HomeScreen";
import WorkoutPlanScreen from "../screens/WorkoutPlanScreen";
import DietPlanScreen from "../screens/DietPlanScreen";
import ExerciseLibraryScreen from "../screens/ExerciseLibraryScreen";
import ExerciseDetailScreen from "../screens/ExerciseDetailScreen";
import ProgressScreen from "../screens/ProgressScreen";
import SettingsScreen from "../screens/SettingsScreen";
import WorkoutPlayerScreen from "../screens/WorkoutPlayerScreen";
import { generateQuickWorkout } from "../utils/workoutGenerator";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.bg, card: colors.surface, text: colors.text, border: colors.border, primary: colors.primary }
};

function TabIcon({ label }: { label: string }) {
  return <Text style={{ fontSize: 18 }}>{label}</Text>;
}

function MainTabs({ onStartWorkout, onStartQuickWorkout }: { onStartWorkout: (d: WorkoutDay) => void; onStartQuickWorkout: () => void }) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted
      }}
    >
      <Tab.Screen name="Home" options={{ tabBarIcon: () => <TabIcon label="🏠" /> }}>
        {() => <HomeScreen onStartWorkout={onStartWorkout} onStartQuickWorkout={onStartQuickWorkout} onOpenPlan={() => {}} />}
      </Tab.Screen>
      <Tab.Screen name="Plan" options={{ tabBarIcon: () => <TabIcon label="📅" /> }}>
        {() => <WorkoutPlanScreen onSelectDay={onStartWorkout} />}
      </Tab.Screen>
      <Tab.Screen name="Diet" component={DietPlanScreen} options={{ tabBarIcon: () => <TabIcon label="🍽️" /> }} />
      <Tab.Screen name="Library" options={{ tabBarIcon: () => <TabIcon label="📚" /> }}>
        {() =>
          selectedExercise ? (
            <ExerciseDetailScreen exercise={selectedExercise} onBack={() => setSelectedExercise(null)} />
          ) : (
            <ExerciseLibraryScreen onSelect={setSelectedExercise} />
          )
        }
      </Tab.Screen>
      <Tab.Screen name="Progress" component={ProgressScreen} options={{ tabBarIcon: () => <TabIcon label="📈" /> }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: () => <TabIcon label="⚙️" /> }} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { loading, profile, setProfileAndGeneratePlans } = useApp();
  const [auth, setAuth] = useState<{ provider: "google" | "apple" | "facebook" | "email"; email: string; name: string } | null>(null);
  const [activeDay, setActiveDay] = useState<WorkoutDay | null>(null);
  const [quickWorkout, setQuickWorkout] = useState<WorkoutDay | null>(null);

  if (loading) return null; // TODO: replace with a splash screen component

  if (!profile) {
    if (!auth) return <AuthScreen onAuthenticated={setAuth} />;
    return <OnboardingScreen auth={auth} onComplete={(p: UserProfile) => setProfileAndGeneratePlans(p)} />;
  }

  const dayInPlayer = activeDay ?? quickWorkout;
  if (dayInPlayer) {
    return (
      <WorkoutPlayerScreen
        day={dayInPlayer}
        onFinish={() => {
          setActiveDay(null);
          setQuickWorkout(null);
        }}
        onExit={() => {
          setActiveDay(null);
          setQuickWorkout(null);
        }}
      />
    );
  }

  function startQuickWorkout() {
    const exercises = generateQuickWorkout(profile!.location, profile!.experienceLevel);
    setQuickWorkout({
      id: "quick-workout",
      dayIndex: 0,
      weekIndex: 0,
      title: "Quick Workout",
      isRestDay: false,
      estimatedMinutes: 20,
      exercises,
      completed: false
    });
  }

  return (
    <NavigationContainer theme={navTheme}>
      <MainTabs onStartWorkout={setActiveDay} onStartQuickWorkout={startQuickWorkout} />
    </NavigationContainer>
  );
}
