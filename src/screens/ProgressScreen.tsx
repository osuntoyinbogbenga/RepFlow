import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store';
import { useTheme } from '../hooks/useTheme';
import { Screen } from '../components/common/Screen';
import { AnimatedCard } from '../components/common/AnimatedCard';
import { WeeklyChart } from '../components/charts/WeeklyChart';
import { Typography, Radius } from '../constants/theme';
import { calculateStats, getWeeklyData, formatDuration } from '../utils/progress';

export function ProgressScreen() {
  const { colors } = useTheme();
  const sessions = useStore(s => s.sessions);
  const stats = useMemo(() => calculateStats(sessions), [sessions]);
  const weeklyData = useMemo(() => getWeeklyData(sessions), [sessions]);
  const totalVolumeKg = useMemo(() =>
    sessions.reduce((sum, s) => s.status !== 'completed' ? sum :
      sum + s.exerciseLogs.reduce((s2, l) =>
        s2 + l.sets.reduce((s3, set) => s3 + set.weight * set.reps, 0), 0), 0),
    [sessions]);

  const statCards = [
    { label: 'Total Sessions', value: String(stats.totalWorkouts), icon: 'barbell-outline', color: colors.accent },
    { label: 'Time Trained', value: formatDuration(stats.totalDurationSeconds), icon: 'time-outline', color: '#8B5CF6' },
    { label: 'This Week', value: String(stats.weeklyWorkouts), icon: 'calendar-outline', color: '#10B981' },
    { label: 'Best Streak', value: `${stats.longestStreak}d`, icon: 'flame-outline', color: '#F59E0B' },
  ];

  return (
    <Screen title="Progress" subtitle="Your">
      <AnimatedCard delay={0} style={{ padding: 20, marginBottom: 14, marginTop: 8 }}>
        <Text style={[Typography.smSemibold, { color: colors.textSecondary, marginBottom: 4 }]}>This Week</Text>
        <Text style={[Typography.h3, { color: colors.text, marginBottom: 20 }]}>
          {stats.weeklyWorkouts} workout{stats.weeklyWorkouts !== 1 ? 's' : ''}
        </Text>
        <WeeklyChart data={weeklyData} />
      </AnimatedCard>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
        {statCards.map((card, i) => (
          <AnimatedCard key={card.label} delay={100 + i * 60} style={{ flex: 1, minWidth: '45%', padding: 16 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: card.color + '18', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={card.icon as any} size={18} color={card.color} />
            </View>
            <Text style={[Typography.numMedium, { color: colors.text, marginTop: 10 }]}>{card.value}</Text>
            <Text style={[Typography.xs, { color: colors.textSecondary, marginTop: 2 }]}>{card.label}</Text>
          </AnimatedCard>
        ))}
      </View>

      <AnimatedCard delay={400} style={{ padding: 20, marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={[Typography.smMedium, { color: colors.textSecondary }]}>Total Volume Lifted</Text>
            <Text style={[Typography.d3, { color: colors.text, marginTop: 4 }]}>{Math.round(totalVolumeKg).toLocaleString()} kg</Text>
          </View>
          <Ionicons name="trending-up" size={32} color={colors.accent} />
        </View>
      </AnimatedCard>

      {sessions.length < 3 && (
        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 600 }}
          style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: Radius.md, borderWidth: 1, backgroundColor: colors.accentMuted, borderColor: colors.accent + '20' }}>
          <Ionicons name="information-circle-outline" size={16} color={colors.accent} />
          <Text style={[Typography.sm, { color: colors.accent, marginLeft: 8, flex: 1 }]}>
            Complete more workouts to unlock detailed progress charts.
          </Text>
        </MotiView>
      )}
    </Screen>
  );
}