import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/common/Button';
import { PressableScale } from '../components/common/PressableScale';
import { Typography, Radius, WorkoutTypeColors } from '../constants/theme';
import { WorkoutType, DayOfWeek } from '../types';

const TYPES: { id: WorkoutType; label: string }[] = [
  { id: 'push', label: 'Push' }, { id: 'pull', label: 'Pull' },
  { id: 'legs', label: 'Legs' }, { id: 'full_body', label: 'Full Body' },
  { id: 'upper', label: 'Upper' }, { id: 'lower', label: 'Lower' },
  { id: 'custom', label: 'Custom' },
];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CreatePlanScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { addPlan, exercises } = useStore(s => ({ addPlan: s.addPlan, exercises: s.exercises }));
  const [name, setName] = useState('');
  const [type, setType] = useState<WorkoutType>('push');
  const [scheduledDays, setScheduledDays] = useState<DayOfWeek[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [step, setStep] = useState<'basics' | 'exercises'>('basics');
  const color = WorkoutTypeColors[type];
  const muscleGroups = [...new Set(exercises.map(e => e.muscleGroup))];

  const handleCreate = async () => {
    if (!name.trim()) { Alert.alert('Name required', 'Give your workout a name.'); return; }
    if (selectedExercises.length === 0) { Alert.alert('Add exercises', 'Select at least one exercise.'); return; }
    await addPlan({
      name: name.trim(), type, color, scheduledDays,
      exercises: selectedExercises.map((exId, i) => {
        const ex = exercises.find(e => e.id === exId)!;
        return { exerciseId: exId, exercise: ex, order: i, restSeconds: 90, sets: [{ reps: 10, weight: 0, weightUnit: 'kg' }, { reps: 10, weight: 0, weightUnit: 'kg' }, { reps: 10, weight: 0, weightUnit: 'kg' }] };
      }),
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <PressableScale onPress={() => navigation.goBack()}>
          <Text style={[Typography.smMedium, { color: colors.textSecondary }]}>Cancel</Text>
        </PressableScale>
        <Text style={[Typography.bodyMedium, { color: colors.text }]}>New Plan</Text>
        {step === 'exercises'
          ? <PressableScale onPress={handleCreate}><Text style={[Typography.smMedium, { color: colors.accent }]}>Create</Text></PressableScale>
          : <PressableScale onPress={() => { if (!name.trim()) { Alert.alert('Name required', ''); return; } setStep('exercises'); }}>
              <Text style={[Typography.smMedium, { color: colors.accent }]}>Next</Text>
            </PressableScale>}
      </View>

      {step === 'basics' ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[Typography.smSemibold, { color: colors.textSecondary, marginBottom: 8 }]}>Workout Name</Text>
          <TextInput value={name} onChangeText={setName} placeholder="e.g. Push Day, Chest & Tris..."
            placeholderTextColor={colors.textTertiary} autoFocus
            style={[styles.input, { color: colors.text, backgroundColor: colors.bgCard, borderColor: colors.border }]} />

          <Text style={[Typography.smSemibold, { color: colors.textSecondary, marginTop: 24, marginBottom: 10 }]}>Workout Type</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {TYPES.map(wt => {
              const sel = type === wt.id;
              const c = WorkoutTypeColors[wt.id];
              return (
                <PressableScale key={wt.id} onPress={() => setType(wt.id)}>
                  <View style={[styles.typeChip, { backgroundColor: sel ? c + '20' : colors.bgCard, borderColor: sel ? c : colors.border }]}>
                    <Text style={[Typography.smSemibold, { color: sel ? c : colors.textSecondary }]}>{wt.label}</Text>
                  </View>
                </PressableScale>
              );
            })}
          </View>

          <Text style={[Typography.smSemibold, { color: colors.textSecondary, marginTop: 24, marginBottom: 10 }]}>Scheduled Days (optional)</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {DAYS.map((label, i) => {
              const isActive = scheduledDays.includes(i as DayOfWeek);
              return (
                <PressableScale key={i} onPress={() => setScheduledDays(prev =>
                  prev.includes(i as DayOfWeek) ? prev.filter(d => d !== i) : [...prev, i as DayOfWeek])}>
                  <View style={[styles.dayCircle, { backgroundColor: isActive ? color : colors.bgCard, borderColor: isActive ? color : colors.border }]}>
                    <Text style={[Typography.xsCaps, { color: isActive ? '#fff' : colors.textSecondary, fontSize: 9 }]}>{label}</Text>
                  </View>
                </PressableScale>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[Typography.smMedium, { color: colors.textSecondary, marginBottom: 4 }]}>{selectedExercises.length} selected</Text>
          {muscleGroups.map(group => (
            <View key={group} style={{ marginBottom: 20 }}>
              <Text style={[Typography.smSemibold, { color: colors.textSecondary, marginBottom: 8 }]}>
                {group.replace('_', ' ').toUpperCase()}
              </Text>
              {exercises.filter(e => e.muscleGroup === group).map(ex => {
                const sel = selectedExercises.includes(ex.id);
                return (
                  <PressableScale key={ex.id} onPress={() => setSelectedExercises(prev =>
                    prev.includes(ex.id) ? prev.filter(id => id !== ex.id) : [...prev, ex.id])}>
                    <MotiView animate={{ backgroundColor: sel ? color + '18' : colors.bgCard }}
                      style={[styles.exRow, { borderColor: sel ? color + '40' : colors.border }]}>
                      <View style={[styles.exCheck, { backgroundColor: sel ? color : 'transparent', borderColor: sel ? color : colors.border }]}>
                        {sel && <Ionicons name="checkmark" size={12} color="#fff" />}
                      </View>
                      <Text style={[Typography.bodyMedium, { color: colors.text, flex: 1 }]}>{ex.name}</Text>
                      <Text style={[Typography.xs, { color: colors.textTertiary }]}>{ex.category}</Text>
                    </MotiView>
                  </PressableScale>
                );
              })}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  content: { padding: 20, paddingBottom: 40 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
  typeChip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 99, borderWidth: 1.5 },
  dayCircle: { width: 38, height: 38, borderRadius: 19, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  exRow: { flexDirection: 'row', alignItems: 'center', padding: 13, borderRadius: 12, borderWidth: 1, marginBottom: 6, gap: 12 },
  exCheck: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});