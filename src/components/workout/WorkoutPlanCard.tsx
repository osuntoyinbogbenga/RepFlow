import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from '../../hooks/useTheme';
import { PressableScale } from '../common/PressableScale';
import { Typography, Radius, Shadows } from '../../constants/theme';
import { WorkoutPlan } from '../../types';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const TYPE_LABELS: Record<string, string> = {
  push: 'Push', pull: 'Pull', legs: 'Legs',
  full_body: 'Full Body', upper: 'Upper', lower: 'Lower', custom: 'Custom',
};

interface Props {
  plan: WorkoutPlan;
  onPress: () => void;
  onLongPress?: () => void;
  index?: number;
}

export function WorkoutPlanCard({ plan, onPress, onLongPress, index = 0 }: Props) {
  const { colors } = useTheme();
  const today = new Date().getDay();

  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 18, delay: index * 80 }}
    >
      <PressableScale onPress={onPress} onLongPress={onLongPress}>
        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }, Shadows.md]}>
          <View style={[styles.colorBar, { backgroundColor: plan.color }]} />
          <View style={styles.content}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <View style={[styles.typeBadge, { backgroundColor: plan.color + '20', borderColor: plan.color + '40' }]}>
                  <Text style={[Typography.xsCaps, { color: plan.color }]}>{TYPE_LABELS[plan.type] || 'Custom'}</Text>
                </View>
                <Text style={[Typography.h2, { color: colors.text, marginTop: 4 }]}>{plan.name}</Text>
              </View>
              <View style={{ alignItems: 'center', marginLeft: 12 }}>
                <Text style={[Typography.numMedium, { color: plan.color }]}>{plan.exercises.length}</Text>
                <Text style={[Typography.xs, { color: colors.textSecondary, marginTop: 2 }]}>exercises</Text>
              </View>
            </View>
            <View style={styles.daysRow}>
              {[0, 1, 2, 3, 4, 5, 6].map(day => {
                const isActive = plan.scheduledDays.includes(day as any);
                const isToday = day === today;
                return (
                  <View key={day} style={[styles.dayDot, {
                    backgroundColor: isActive ? plan.color : colors.borderSubtle,
                    borderWidth: isToday ? 1.5 : 0,
                    borderColor: plan.color,
                    opacity: isActive ? 1 : 0.4,
                  }]}>
                    <Text style={[Typography.xsCaps, { color: isActive ? '#fff' : colors.textTertiary, fontSize: 9 }]}>
                      {DAY_LABELS[day]}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </PressableScale>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: Radius.lg, borderWidth: 1, marginBottom: 12, flexDirection: 'row', overflow: 'hidden' },
  colorBar: { width: 4 },
  content: { flex: 1, padding: 16 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  typeBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, borderWidth: 1 },
  daysRow: { flexDirection: 'row', marginTop: 12, gap: 6 },
  dayDot: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
});