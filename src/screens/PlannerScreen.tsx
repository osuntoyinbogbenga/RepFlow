import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store';
import { useTheme } from '../hooks/useTheme';
import { Screen } from '../components/common/Screen';
import { Button } from '../components/common/Button';
import { WorkoutPlanCard } from '../components/workout/WorkoutPlanCard';
import { Typography, Radius } from '../constants/theme';

export function PlannerScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { workoutPlans, deletePlan } = useStore(s => ({ workoutPlans: s.workoutPlans, deletePlan: s.deletePlan }));

  const handleDelete = (id: string, name: string) => {
    Alert.alert(`Delete "${name}"?`, 'Completed sessions are preserved.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deletePlan(id) },
    ]);
  };

  return (
    <Screen title="Workout Plans" subtitle="Planner"
      rightAction={<Button title="New Plan" size="sm" onPress={() => navigation.navigate('CreatePlan')} leftIcon={<Ionicons name="add" size={14} color="#fff" />} />}>
      {workoutPlans.length === 0 ? (
        <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          style={[styles.empty, { borderColor: colors.border, backgroundColor: colors.bgCard }]}>
          <Ionicons name="barbell-outline" size={40} color={colors.textSecondary} />
          <Text style={[Typography.h3, { color: colors.text, marginTop: 12 }]}>No plans yet</Text>
          <Text style={[Typography.sm, { color: colors.textSecondary, marginTop: 6, textAlign: 'center' }]}>
            Create your first workout plan to get started.
          </Text>
          <Button title="Create Plan" onPress={() => navigation.navigate('CreatePlan')} style={{ marginTop: 20 }} />
        </MotiView>
      ) : (
        <>
          {workoutPlans.map((plan, i) => (
            <WorkoutPlanCard key={plan.id} plan={plan} index={i}
              onPress={() => navigation.navigate('WorkoutDetail', { planId: plan.id })}
              onLongPress={() => handleDelete(plan.id, plan.name)} />
          ))}
          <Text style={[Typography.xs, { color: colors.textTertiary, textAlign: 'center', marginTop: 8 }]}>
            Long press a plan to delete it
          </Text>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: { marginTop: 40, padding: 40, borderRadius: Radius.xl, borderWidth: 1, alignItems: 'center' },
});