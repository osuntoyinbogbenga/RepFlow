import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { PressableScale } from '../common/PressableScale';
import { Typography, Radius } from '../../constants/theme';
import { PlannedSet, CompletedSet } from '../../types';

interface Props {
  setNumber: number;
  planned: PlannedSet;
  completed?: CompletedSet;
  onComplete: (data: { reps: number; weight: number }) => void;
  isNext: boolean;
}

export function SetRow({ setNumber, planned, completed, onComplete, isNext }: Props) {
  const { colors } = useTheme();
  const [reps, setReps] = useState(String(planned.reps));
  const [weight, setWeight] = useState(String(planned.weight));
  const isDone = !!completed;

  return (
    <MotiView
      animate={{ opacity: isDone ? 0.6 : 1, scale: isNext ? 1.01 : 1 }}
      transition={{ type: 'timing', duration: 300 }}
      style={[styles.row, {
        backgroundColor: isDone ? colors.successMuted : isNext ? colors.accentMuted : colors.bgCard,
        borderColor: isDone ? colors.success + '30' : isNext ? colors.accent + '30' : colors.border,
      }]}
    >
      <View style={styles.setNum}>
        {isDone
          ? <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          : <Text style={[Typography.smSemibold, { color: colors.textSecondary }]}>{setNumber}</Text>}
      </View>
      <View style={{ flex: 1.4 }}>
        <Text style={[Typography.sm, { color: colors.textTertiary }]}>{planned.weight}{planned.weightUnit} × {planned.reps}</Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        {isDone
          ? <Text style={[Typography.bodySemibold, { color: colors.success }]}>{completed!.weight}</Text>
          : <TextInput value={weight} onChangeText={setWeight} keyboardType="decimal-pad"
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.bgSecondary }]}
              selectTextOnFocus />}
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        {isDone
          ? <Text style={[Typography.bodySemibold, { color: colors.success }]}>{completed!.reps}</Text>
          : <TextInput value={reps} onChangeText={setReps} keyboardType="number-pad"
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.bgSecondary }]}
              selectTextOnFocus />}
      </View>
      <PressableScale onPress={() => { if (isDone) return; Keyboard.dismiss(); onComplete({ reps: parseInt(reps) || planned.reps, weight: parseFloat(weight) || planned.weight }); }} disabled={isDone}>
        <View style={[styles.checkBtn, { backgroundColor: isDone ? colors.successMuted : isNext ? colors.accent : colors.border }]}>
          <Ionicons name="checkmark" size={16} color={isDone ? colors.success : isNext ? '#fff' : colors.textTertiary} />
        </View>
      </PressableScale>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: Radius.md, borderWidth: 1, marginBottom: 6, gap: 8 },
  setNum: { width: 28, alignItems: 'center' },
  input: { borderWidth: 1, borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 5, textAlign: 'center', width: 56, fontSize: 15, fontWeight: '600' },
  checkBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});