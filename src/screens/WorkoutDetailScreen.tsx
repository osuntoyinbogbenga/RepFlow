import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/common/Button';
import { AnimatedCard } from '../components/common/AnimatedCard';
import { PressableScale } from '../components/common/PressableScale';
import { Typography, MuscleGroupLabels } from '../constants/theme';

export function WorkoutDetailScreen({ navigation, route }: any) {
  const { colors } = useTheme();
  const { planId } = route.params;
  const { plan, startSession, activeSession } = useStore(s => ({
    plan: s.workoutPlans.find(p => p.id === planId),
    startSession: s.startSession,
    activeSession: s.activeSession,
  }));
  if (!plan) return null;

  const totalSets = plan.exercises.reduce((sum, e) => sum + e.sets.length, 0);
  const estimatedMinutes = Math.round(plan.exercises.reduce((sum, e) => sum + e.sets.length * (e.restSeconds + 45), 0) / 60);

  const handleStart = () => {
    if (activeSession.session) {
      Alert.alert('Session active', 'End current session first.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Go to session', onPress: () => navigation.navigate('ActiveWorkout') },
      ]);
      return;
    }
    startSession(plan);
    navigation.navigate('ActiveWorkout');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <LinearGradient colors={[plan.color + '30', 'transparent']} style={styles.hero}>
        <PressableScale onPress={() => navigation.goBack()} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </PressableScale>
        <View style={{ marginTop: 8 }}>
          <View style={[styles.typeBadge, { backgroundColor: plan.color + '25', borderColor: plan.color + '50' }]}>
            <Text style={[Typography.xsCaps, { color: plan.color }]}>{plan.type.replace('_', ' ').toUpperCase()}</Text>
          </View>
          <Text style={[Typography.d3, { color: colors.text, marginTop: 8 }]}>{plan.name}</Text>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
            {[
              { icon: 'layers-outline', label: `${plan.exercises.length} exercises` },
              { icon: 'repeat-outline', label: `${totalSets} sets` },
              { icon: 'time-outline', label: `~${estimatedMinutes}m` },
            ].map(m => (
              <View key={m.label} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={m.icon as any} size={14} color={colors.textSecondary} />
                <Text style={[Typography.sm, { color: colors.textSecondary, marginLeft: 4 }]}>{m.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {plan.exercises.map((we, i) => (
          <AnimatedCard key={we.exerciseId} delay={i * 60} style={{ padding: 16, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <Text style={[Typography.smSemibold, { color: plan.color }]}>{i + 1}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.bodyMedium, { color: colors.text }]}>{we.exercise.name}</Text>
                <Text style={[Typography.sm, { color: colors.textSecondary, marginTop: 2 }]}>
                  {MuscleGroupLabels[we.exercise.muscleGroup]} · {we.exercise.category}
                </Text>
              </View>
              <Text style={[Typography.smMedium, { color: colors.textSecondary }]}>Rest: {we.restSeconds}s</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {we.sets.map((set, si) => (
                <View key={si} style={[styles.setChip, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
                  <Text style={[Typography.smSemibold, { color: colors.text }]}>{set.weight}{set.weightUnit}</Text>
                  <Text style={[Typography.xs, { color: colors.textSecondary }]}>× {set.reps}</Text>
                </View>
              ))}
            </View>
          </AnimatedCard>
        ))}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.bg, borderTopColor: colors.border }]}>
        <Button title={`Start ${plan.name}`} onPress={handleStart} size="lg" fullWidth
          leftIcon={<Ionicons name="play" size={18} color="#fff" />} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },
  typeBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, borderWidth: 1 },
  setChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 32, borderTopWidth: StyleSheet.hairlineWidth },
});