import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store';
import { useTheme } from '../hooks/useTheme';
import { PressableScale } from '../components/common/PressableScale';
import { AnimatedCard } from '../components/common/AnimatedCard';
import { StreakBadge } from '../components/common/StreakBadge';
import { WorkoutPlanCard } from '../components/workout/WorkoutPlanCard';
import { Typography, Shadows } from '../constants/theme';
import { calculateStats, getMotivationalQuote } from '../utils/progress';

export function DashboardScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { workoutPlans, sessions, user, activeSession } = useStore(s => ({
    workoutPlans: s.workoutPlans, sessions: s.sessions,
    user: s.user, activeSession: s.activeSession,
  }));
  const stats = useMemo(() => calculateStats(sessions), [sessions]);
  const quote = useMemo(() => getMotivationalQuote(), []);
  const today = new Date();
  const todayDay = today.getDay() as any;
  const todayWorkouts = workoutPlans.filter(p => p.scheduledDays.includes(todayDay));
  const upcomingPlan = todayWorkouts[0];
  const hasActiveSession = !!activeSession.session;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

      <MotiView from={{ opacity: 0, translateY: -10 }} animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400 }} style={styles.header}>
        <View>
          <Text style={[Typography.smMedium, { color: colors.textSecondary }]}>{format(today, 'EEEE, MMMM d')}</Text>
          <Text style={[Typography.d3, { color: colors.text }]}>Hey, {user?.name || 'Athlete'} 👋</Text>
        </View>
        <PressableScale onPress={() => navigation.navigate('Settings')}>
          <View style={[styles.avatar, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
          </View>
        </PressableScale>
      </MotiView>

      <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 600, delay: 100 }}
        style={[styles.quoteBanner, { backgroundColor: colors.accentMuted, borderColor: colors.accent + '25' }]}>
        <Ionicons name="flash" size={14} color={colors.accent} />
        <Text style={[Typography.smMedium, { color: colors.accent, marginLeft: 6, fontStyle: 'italic' }]}>{quote}</Text>
      </MotiView>

      <View style={styles.streakRow}>
        <StreakBadge streak={stats.currentStreak} />
        <View style={styles.miniStats}>
          <View style={{ alignItems: 'center' }}>
            <Text style={[Typography.numMedium, { color: colors.text }]}>{stats.weeklyWorkouts}</Text>
            <Text style={[Typography.xs, { color: colors.textSecondary }]}>this week</Text>
          </View>
          <View style={{ width: 1, height: 24, backgroundColor: colors.border }} />
          <View style={{ alignItems: 'center' }}>
            <Text style={[Typography.numMedium, { color: colors.text }]}>{stats.totalWorkouts}</Text>
            <Text style={[Typography.xs, { color: colors.textSecondary }]}>total</Text>
          </View>
        </View>
      </View>

      {hasActiveSession && (
        <MotiView from={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 18 }}>
          <PressableScale onPress={() => navigation.navigate('ActiveWorkout')}>
            <LinearGradient colors={[colors.accent, colors.accentDim]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={[styles.activeBanner, Shadows.accent(colors.accent)]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MotiView animate={{ scale: [1, 1.15, 1] }} transition={{ loop: true, type: 'timing', duration: 1400 }}>
                  <Ionicons name="radio-button-on" size={16} color="#fff" />
                </MotiView>
                <Text style={[Typography.bodySemibold, { color: '#fff', marginLeft: 8 }]}>
                  Session in progress — {activeSession.plan?.name}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
            </LinearGradient>
          </PressableScale>
        </MotiView>
      )}

      <Text style={[Typography.h2, { color: colors.text, marginTop: 24, marginBottom: 12 }]}>Today's Plan</Text>

      {todayWorkouts.length === 0 ? (
        <AnimatedCard delay={200} style={styles.restCard}>
          <Ionicons name="moon-outline" size={28} color={colors.textSecondary} />
          <Text style={[Typography.h3, { color: colors.text, marginTop: 8 }]}>Rest Day</Text>
          <Text style={[Typography.sm, { color: colors.textSecondary, marginTop: 4, textAlign: 'center' }]}>
            No workout scheduled. Recovery matters.
          </Text>
        </AnimatedCard>
      ) : (
        todayWorkouts.map((plan, i) => (
          <WorkoutPlanCard key={plan.id} plan={plan} index={i}
            onPress={() => navigation.navigate('WorkoutDetail', { planId: plan.id })} />
        ))
      )}

      {upcomingPlan && !hasActiveSession && (
        <MotiView from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 16, delay: 300 }} style={{ marginTop: 4, marginBottom: 16 }}>
          <PressableScale onPress={() => { useStore.getState().startSession(upcomingPlan); navigation.navigate('ActiveWorkout'); }}>
            <LinearGradient colors={[upcomingPlan.color, upcomingPlan.color + 'CC']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={[styles.startBtn, Shadows.accent(upcomingPlan.color)]}>
              <Ionicons name="play" size={22} color="#fff" />
              <Text style={[Typography.h2, { color: '#fff', marginLeft: 10 }]}>Start {upcomingPlan.name}</Text>
            </LinearGradient>
          </PressableScale>
        </MotiView>
      )}

      {sessions.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={[Typography.h2, { color: colors.text }]}>Recent</Text>
            <PressableScale onPress={() => navigation.navigate('History')}>
              <Text style={[Typography.smMedium, { color: colors.accent }]}>See all</Text>
            </PressableScale>
          </View>
          {sessions.slice(0, 2).map((session, i) => (
            <AnimatedCard key={session.id} delay={200 + i * 60} style={[styles.historyCard, { marginBottom: 8 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={[Typography.bodyMedium, { color: colors.text }]}>{session.planName}</Text>
                  <Text style={[Typography.sm, { color: colors.textSecondary, marginTop: 2 }]}>
                    {format(new Date(session.startedAt), 'EEE, MMM d')}
                  </Text>
                </View>
                <Text style={[Typography.smSemibold, { color: colors.textSecondary }]}>
                  {Math.floor(session.durationSeconds / 60)}m
                </Text>
              </View>
            </AnimatedCard>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  avatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  quoteBanner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, marginBottom: 20 },
  streakRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  miniStats: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  activeBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, marginBottom: 16 },
  restCard: { padding: 28, alignItems: 'center', marginBottom: 16 },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 8 },
  historyCard: { padding: 16 },
});