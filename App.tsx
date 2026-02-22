import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator } from 'react-native';
import { useStore } from './src/store';
import { AppNavigator } from './src/navigation';
import { useTheme } from './src/hooks/useTheme';

function AppContent() {
  const { colors, isDark } = useTheme();
  const { isLoaded, initialize } = useStore(s => ({
    isLoaded: s.isLoaded,
    initialize: s.initialize,
  }));

  useEffect(() => {
    initialize();
  }, []);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0D0D0F', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#3D7BFF" size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}