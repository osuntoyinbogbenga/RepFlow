import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { useTheme } from '../hooks/useTheme';
import { PressableScale } from '../components/common/PressableScale';
import { AnimatedCard } from '../components/common/AnimatedCard';
import { Typography } from '../constants/theme';
import { formatDuration } from '../utils/progress';

export function SessionDetailScreen({ navigation, route }: any) {
  const { colors } = useTheme();
  const session = useStore(s => s.sessions.find(s => s.id === route.params.sessionId));
  if (!session) return null;

  const totalSets = session.exerciseLogs.reduce((sum, l) => sum + l.sets.length, 0);
  const totalVolume = session.exerciseLogs.reduce(
    (sum, l) => sum + l.sets.reduce((s2, set) => s2 + set.weight * set.reps, 0), 0
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <PressableScale onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </PressableScale>
        <Text style={[Typography.bodyMedium, { color: colors.text }]}>{session.planName}</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <AnimatedCard delay={0} style={{ padding: 16, marginBottom: 16 }}>
          <Text style={[Typography.smMedium, { color: colors.textSecondary }]}>
            {format(new Date(session.startedAt), 'EEEE, MMMM d yyyy')} · {format(new Date(session.startedAt), 'h:mm a')}
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 16 }}>
            {[
              { value: formatDuration(session.durationSeconds), label: 'Duration' },
              { value: String(totalSets), label: 'Sets' },
              { value: Math.round(totalVolume).toLocaleString(), label: 'Volume (kg)' },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <View style={{ width: 1, height: 40, backgroundColor: colors.border, alignSelf: 'center' }} />}
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={[Typography.numMedium, { color: colors.text }]}>{s.value}</Text>
                  <Text style={[Typography.xs, { color: colors.textSecondary, marginTop: 2 }]}>{s.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </AnimatedCard>

        {session.exerciseLogs.map((log, i) => (
          <AnimatedCard key={log.exerciseId} delay={100 + i * 60} style={{ padding: 16, marginBottom: 10 }}>
            <Text style={[Typography.bodyMedium, { color: colors.text, marginBottom: 10 }]}>{log.exerciseName}</Text>
            {log.sets.length === 0
              ? <Text style={[Typography.sm, { color: colors.textTertiary }]}>No sets recorded</Text>
              : log.sets.map((set, si) => (
                <View key={si} style={[styles.setRow, { borderBottomColor: colors.borderSubtle }]}>
                  <Text style={[Typography.smMedium, { color: colors.textSecondary, width: 20 }]}>{si + 1}</Text>
                  <Text style={[Typography.bodyMedium, { color: colors.text }]}>{set.weight} {set.weightUnit}</Text>
                  <Text style={[Typography.smMedium, { color: colors.textSecondary }]}>×</Text>
                  <Text style={[Typography.bodyMedium, { color: colors.text }]}>{set.reps} reps</Text>
                </View>
              ))}
          </AnimatedCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  setRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7, borderBottomWidth: StyleSheet.hairlineWidth },
});