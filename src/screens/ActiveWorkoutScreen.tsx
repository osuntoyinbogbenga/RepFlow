import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { useTheme } from '../hooks/useTheme';
import { PressableScale } from '../components/common/PressableScale';
import { Button } from '../components/common/Button';
import { SetRow } from '../components/workout/SetRow';
import { RestTimer } from '../components/workout/RestTimer';
import { Typography } from '../constants/theme';
import { useWorkoutTimer } from '../hooks/useWorkoutTimer';
import { useHaptics } from '../hooks/useHaptics';

export function ActiveWorkoutScreen({ navigation }: any) {
  const { colors } = useTheme();
  const haptic = useHaptics();
  const { activeSession, completeSet, nextExercise, togglePause, startRest, stopRest, endSession, abandonSession } = useStore(s => ({
    activeSession: s.activeSession, completeSet: s.completeSet,
    nextExercise: s.nextExercise, togglePause: s.togglePause,
    startRest: s.startRest, stopRest: s.stopRest,
    endSession: s.endSession, abandonSession: s.abandonSession,
  }));
  const { session, plan, currentExerciseIndex, isPaused, isResting, restSecondsRemaining } = activeSession;
  const { seconds, formatted: timerFormatted } = useWorkoutTimer(!!session);
  const [showEnd, setShowEnd] = useState(false);

  useEffect(() => {
    if (session) {
      useStore.setState(s => ({
        activeSession: {
          ...s.activeSession,
          session: s.activeSession.session
            ? { ...s.activeSession.session, durationSeconds: seconds }
            : null,
        },
      }));
    }
  }, [seconds]);

  if (!session || !plan) { navigation.goBack(); return null; }

  const isLastExercise = currentExerciseIndex >= plan.exercises.length - 1;
  const progressPercent = (currentExerciseIndex / plan.exercises.length) * 100;

  const handleSetComplete = (exIdx: number, setIdx: number, data: { reps: number; weight: number }) => {
    haptic.notification();
    completeSet(exIdx, setIdx, data);
    const exercise = plan.exercises[exIdx];
    const isLastSet = setIdx >= exercise.sets.length - 1;
    setTimeout(() => {
      if (exercise.restSeconds > 0) startRest(exercise.restSeconds);
      else if (isLastSet && !isLastExercise) nextExercise();
    }, 400);
  };

  const handleRestComplete = () => {
    haptic.notification();
    stopRest();
    const log = session.exerciseLogs[currentExerciseIndex];
    const exercise = plan.exercises[currentExerciseIndex];
    if (log?.sets.length >= exercise.sets.length && !isLastExercise) nextExercise();
  };

  const handleEnd = async () => {
    haptic.notification();
    await endSession();
    navigation.navigate('WorkoutComplete');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <PressableScale onPress={() => setShowEnd(true)}>
          <Text style={[Typography.smMedium, { color: colors.error }]}>End</Text>
        </PressableScale>
        <MotiView animate={{ opacity: isPaused ? 0.4 : 1 }} transition={{ type: 'timing', duration: 300 }}>
          <Text style={[Typography.numMedium, { color: colors.text }]}>{timerFormatted}</Text>
        </MotiView>
        <PressableScale onPress={togglePause}>
          <View style={[styles.pauseBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <Ionicons name={isPaused ? 'play' : 'pause'} size={16} color={colors.textSecondary} />
          </View>
        </PressableScale>
      </View>

      <View style={[styles.progressTrack, { backgroundColor: colors.borderSubtle }]}>
        <MotiView animate={{ width: `${progressPercent}%` as any }}
          transition={{ type: 'timing', duration: 500 }}
          style={[styles.progressFill, { backgroundColor: plan.color }]} />
      </View>

      <View style={{ paddingHorizontal: 20, paddingVertical: 8 }}>
        <Text style={[Typography.smMedium, { color: colors.textSecondary }]}>
          {plan.name} · Exercise {Math.min(currentExerciseIndex + 1, plan.exercises.length)} of {plan.exercises.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        {plan.exercises.map((we, exIdx) => {
          const log = session.exerciseLogs[exIdx];
          const isCurrent = exIdx === currentExerciseIndex;
          const isPast = exIdx < currentExerciseIndex;

          return (
            <MotiView key={we.exerciseId}
              animate={{ opacity: isPast ? 0.45 : exIdx > currentExerciseIndex ? 0.6 : 1, scale: isCurrent ? 1 : 0.98 }}
              transition={{ type: 'spring', damping: 20 }}
              style={[styles.exBlock, {
                backgroundColor: colors.bgCard,
                borderColor: isCurrent ? plan.color + '60' : colors.border,
                borderWidth: isCurrent ? 1.5 : 1,
              }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.h3, { color: colors.text }]}>{we.exercise.name}</Text>
                  <Text style={[Typography.sm, { color: colors.textSecondary, marginTop: 2 }]}>{we.sets.length} sets · {we.restSeconds}s rest</Text>
                </View>
                {isPast && <Ionicons name="checkmark-circle" size={24} color={colors.success} />}
                {isCurrent && (
                  <View style={[styles.currentBadge, { backgroundColor: plan.color + '20', borderColor: plan.color + '40' }]}>
                    <Text style={[Typography.xsCaps, { color: plan.color }]}>Current</Text>
                  </View>
                )}
              </View>

              {(isCurrent || isPast) && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8, paddingHorizontal: 4 }}>
                  <View style={{ width: 28 }} />
                  <Text style={[Typography.xsCaps, { color: colors.textTertiary, flex: 1.4 }]}>Planned</Text>
                  <Text style={[Typography.xsCaps, { color: colors.textTertiary, flex: 1, textAlign: 'center' }]}>KG</Text>
                  <Text style={[Typography.xsCaps, { color: colors.textTertiary, flex: 1, textAlign: 'center' }]}>REPS</Text>
                  <View style={{ width: 32 }} />
                </View>
              )}

              {(isCurrent || isPast) && we.sets.map((plannedSet, setIdx) => (
                <SetRow key={setIdx} setNumber={setIdx + 1} planned={plannedSet}
                  completed={log?.sets[setIdx]}
                  onComplete={(data) => handleSetComplete(exIdx, setIdx, data)}
                  isNext={isCurrent && setIdx === (log?.sets.length || 0)} />
              ))}
            </MotiView>
          );
        })}

        <Button title="Finish Workout" variant="secondary" onPress={() => setShowEnd(true)}
          style={{ marginTop: 16 }} fullWidth
          leftIcon={<Ionicons name="flag-outline" size={16} color={colors.textSecondary} />} />
        <View style={{ height: 40 }} />
      </ScrollView>

      <RestTimer visible={isResting} seconds={restSecondsRemaining}
        onComplete={handleRestComplete} onSkip={handleRestComplete} />

      <Modal visible={showEnd} transparent animationType="fade">
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <MotiView from={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 18 }}
            style={[styles.modal, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <Ionicons name="flag" size={32} color={colors.accent} style={{ marginBottom: 12 }} />
            <Text style={[Typography.h2, { color: colors.text, marginBottom: 8 }]}>End workout?</Text>
            <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center', marginBottom: 24 }]}>
              Your progress so far will be saved.
            </Text>
            <Button title="Save & End" onPress={handleEnd} fullWidth />
            <Button title="Abandon Session" variant="danger"
              onPress={() => { abandonSession(); setShowEnd(false); navigation.goBack(); }}
              style={{ marginTop: 8 }} fullWidth />
            <Button title="Keep Going" variant="ghost"
              onPress={() => setShowEnd(false)} style={{ marginTop: 4 }} fullWidth />
          </MotiView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  pauseBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  progressTrack: { height: 3, width: '100%' },
  progressFill: { height: '100%', borderRadius: 2 },
  exBlock: { borderRadius: 16, padding: 16, marginBottom: 10, overflow: 'hidden' },
  currentBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, borderWidth: 1 },
  modalOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  modal: { borderRadius: 24, borderWidth: 1, padding: 28, alignItems: 'center', width: '100%', maxWidth: 360 },
});