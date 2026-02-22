import React from 'react';
import { View, Text, StyleSheet, Switch, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { useTheme } from '../hooks/useTheme';
import { AnimatedCard } from '../components/common/AnimatedCard';
import { PressableScale } from '../components/common/PressableScale';
import { Typography } from '../constants/theme';
import { DayOfWeek } from '../types';

const DAYS = [
  { day: 1, label: 'Monday', s: 'M' }, { day: 2, label: 'Tuesday', s: 'T' },
  { day: 3, label: 'Wednesday', s: 'W' }, { day: 4, label: 'Thursday', s: 'T' },
  { day: 5, label: 'Friday', s: 'F' }, { day: 6, label: 'Saturday', s: 'S' },
  { day: 0, label: 'Sunday', s: 'S' },
];
const TIMES = ['05:00','06:00','07:00','08:00','09:00','10:00','12:00','17:00','18:00','19:00','20:00','21:00'];

function fmtTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

export function ScheduleScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { schedule, saveSchedule } = useStore(s => ({ schedule: s.schedule, saveSchedule: s.saveSchedule }));
  const toggleDay = (day: DayOfWeek) => saveSchedule({
    gymDays: schedule.gymDays.includes(day) ? schedule.gymDays.filter(d => d !== day) : [...schedule.gymDays, day],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      {/* Header with back button */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <PressableScale onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </PressableScale>
        <Text style={[Typography.h2, { color: colors.text }]}>Schedule</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <Text style={[Typography.smMedium, { color: colors.textSecondary, marginBottom: 12, marginTop: 16 }]}>
          Select your gym days
        </Text>
        <AnimatedCard delay={0} style={{ overflow: 'hidden' }}>
          {DAYS.map(({ day, label, s }) => {
            const isActive = schedule.gymDays.includes(day as DayOfWeek);
            return (
              <PressableScale key={day} onPress={() => toggleDay(day as DayOfWeek)}>
                <View style={[styles.row, { borderBottomColor: colors.borderSubtle }, isActive && { backgroundColor: colors.accentMuted }]}>
                  <View style={[styles.dayBadge, { backgroundColor: isActive ? colors.accent : colors.bgSecondary, borderColor: isActive ? colors.accent : colors.border }]}>
                    <Text style={[Typography.xsCaps, { color: isActive ? '#fff' : colors.textSecondary }]}>{s}</Text>
                  </View>
                  <Text style={[Typography.bodyMedium, { color: colors.text, flex: 1, marginLeft: 14 }]}>{label}</Text>
                  {isActive && <Ionicons name="checkmark-circle" size={20} color={colors.accent} />}
                </View>
              </PressableScale>
            );
          })}
        </AnimatedCard>

        <Text style={[Typography.xsCaps, { color: colors.textSecondary, marginBottom: 10, marginTop: 20 }]}>Preferred Time</Text>
        <AnimatedCard delay={200}>
          <PressableScale onPress={() => Alert.alert('Preferred Gym Time', 'When do you usually work out?',
            TIMES.map(t => ({ text: fmtTime(t), onPress: () => saveSchedule({ preferredTime: t }) })))}>
            <View style={[styles.row, { borderBottomColor: 'transparent' }]}>
              <View style={[styles.iconWrap, { backgroundColor: colors.accent + '18' }]}>
                <Ionicons name="alarm-outline" size={16} color={colors.accent} />
              </View>
              <Text style={[Typography.bodyMedium, { color: colors.text, flex: 1, marginLeft: 12 }]}>Workout Time</Text>
              <Text style={[Typography.smMedium, { color: colors.textSecondary }]}>{fmtTime(schedule.preferredTime)}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} style={{ marginLeft: 4 }} />
            </View>
          </PressableScale>
        </AnimatedCard>

        <Text style={[Typography.xsCaps, { color: colors.textSecondary, marginBottom: 10, marginTop: 20 }]}>Reminders</Text>
        <AnimatedCard delay={300}>
          <View style={[styles.row, { borderBottomColor: 'transparent' }]}>
            <View style={[styles.iconWrap, { backgroundColor: '#F59E0B18' }]}>
              <Ionicons name="notifications-outline" size={16} color="#F59E0B" />
            </View>
            <Text style={[Typography.bodyMedium, { color: colors.text, flex: 1, marginLeft: 12 }]}>Workout Reminders</Text>
            <Switch value={schedule.reminderEnabled} onValueChange={v => saveSchedule({ reminderEnabled: v })}
              trackColor={{ true: colors.accent }} thumbColor="#fff" />
          </View>
        </AnimatedCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: StyleSheet.hairlineWidth },
  dayBadge: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  iconWrap: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});