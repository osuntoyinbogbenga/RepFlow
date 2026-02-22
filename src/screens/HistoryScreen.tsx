import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { format, isToday, isYesterday } from 'date-fns';
import { useStore } from '../store';
import { useTheme } from '../hooks/useTheme';
import { Screen } from '../components/common/Screen';
import { PressableScale } from '../components/common/PressableScale';
import { Typography, Radius } from '../constants/theme';
import { formatDuration } from '../utils/progress';
import { WorkoutSession } from '../types';

function fmtDate(d: string) {
  const dt = new Date(d);
  if (isToday(dt)) return 'Today';
  if (isYesterday(dt)) return 'Yesterday';
  return format(dt, 'EEEE, MMM d');
}

export function HistoryScreen({ navigation }: any) {
  const { colors } = useTheme();
  const sessions = useStore(s => s.sessions.filter(s => s.status === 'completed'));

  const renderItem = ({ item, index }: { item: WorkoutSession; index: number }) => {
    const totalSets = item.exerciseLogs.reduce((sum, l) => sum + l.sets.length, 0);
    return (
      <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 18, delay: index * 50 }} style={{ marginBottom: 10 }}>
        <PressableScale onPress={() => navigation.navigate('SessionDetail', { sessionId: item.id })}>
          <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.bodyMedium, { color: colors.text }]}>{item.planName}</Text>
                <Text style={[Typography.sm, { color: colors.textSecondary, marginTop: 3 }]}>{fmtDate(item.startedAt)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
            </View>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              {[
                { icon: 'time-outline', label: formatDuration(item.durationSeconds) },
                { icon: 'layers-outline', label: `${item.exerciseLogs.length} exercises` },
                { icon: 'repeat-outline', label: `${totalSets} sets` },
              ].map(s => (
                <View key={s.label} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name={s.icon as any} size={13} color={colors.textSecondary} />
                  <Text style={[Typography.smMedium, { color: colors.textSecondary, marginLeft: 4 }]}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </PressableScale>
      </MotiView>
    );
  };

  return (
    <Screen title="History" subtitle="Workout" scrollable={false} noPadding>
      {sessions.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="calendar-outline" size={40} color={colors.textSecondary} />
          <Text style={[Typography.h3, { color: colors.text, marginTop: 12 }]}>No sessions yet</Text>
          <Text style={[Typography.sm, { color: colors.textSecondary, marginTop: 6, textAlign: 'center' }]}>
            Complete your first workout to see it here.
          </Text>
        </View>
      ) : (
        <FlatList data={sessions} keyExtractor={item => item.id} renderItem={renderItem}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={[Typography.smMedium, { color: colors.textSecondary, marginBottom: 12 }]}>
              {sessions.length} session{sessions.length !== 1 ? 's' : ''}
            </Text>
          } />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  card: { borderRadius: Radius.lg, borderWidth: 1, padding: 16 },
});