import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useStore } from '../store';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/common/Button';
import { Typography } from '../constants/theme';
import { formatDuration } from '../utils/progress';

export function WorkoutCompleteScreen({ navigation }: any) {
  const { colors } = useTheme();
  const sessions = useStore(s => s.sessions);
  const lastSession = sessions[0];

  useEffect(() => {
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const totalSets = lastSession?.exerciseLogs.reduce((sum, l) => sum + l.sets.length, 0) || 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.container}>
        <MotiView from={{ scale: 0, rotate: '-20deg' }} animate={{ scale: 1, rotate: '0deg' }}
          transition={{ type: 'spring', damping: 12, delay: 100 }}>
          <LinearGradient colors={[colors.success, '#16A34A']} style={styles.iconBg}>
            <Ionicons name="checkmark" size={48} color="#fff" />
          </LinearGradient>
        </MotiView>

        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 300 }}>
          <Text style={[Typography.d2, { color: colors.text, textAlign: 'center' }]}>Workout Done!</Text>
          <Text style={[Typography.bodyMedium, { color: colors.textSecondary, textAlign: 'center', marginTop: 8 }]}>
            {lastSession?.planName}
          </Text>
        </MotiView>

        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 500 }}
          style={[styles.statsRow, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          {[
            { value: formatDuration(lastSession?.durationSeconds || 0), label: 'Duration' },
            { value: String(lastSession?.exerciseLogs.length || 0), label: 'Exercises' },
            { value: String(totalSets), label: 'Sets' },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <View style={{ width: 1, height: 40, backgroundColor: colors.border }} />}
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={[Typography.numMedium, { color: colors.text }]}>{s.value}</Text>
                <Text style={[Typography.xs, { color: colors.textSecondary, marginTop: 4 }]}>{s.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </MotiView>

        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 400, delay: 700 }}
          style={{ width: '100%', maxWidth: 360 }}>
          <Button title="Done" size="lg" fullWidth
            onPress={() => navigation.navigate('MainTabs', { screen: 'Dashboard' })} />
          <Button title="View History" variant="ghost" style={{ marginTop: 8 }}
            onPress={() => navigation.navigate('MainTabs', { screen: 'History' })} />
        </MotiView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center', gap: 24 },
  iconBg: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, padding: 24, width: '100%', maxWidth: 360 },
});