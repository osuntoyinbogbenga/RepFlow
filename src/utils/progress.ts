import { WorkoutSession, ProgressStats } from '../types';
import { startOfWeek, startOfMonth, isAfter, parseISO, differenceInDays } from 'date-fns';

export function calculateStats(sessions: WorkoutSession[]): ProgressStats {
  const completed = sessions.filter(s => s.status === 'completed');
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const weeklyWorkouts = completed.filter(s => isAfter(parseISO(s.startedAt), weekStart)).length;
  const monthlyWorkouts = completed.filter(s => isAfter(parseISO(s.startedAt), monthStart)).length;
  const totalDurationSeconds = completed.reduce((sum, s) => sum + s.durationSeconds, 0);

  const sortedDates = completed
    .map(s => parseISO(s.startedAt))
    .sort((a, b) => b.getTime() - a.getTime());

  const uniqueDates = sortedDates.filter((d, i, arr) =>
    i === 0 || differenceInDays(arr[i - 1], d) > 0
  );

  let streak = 0;
  for (let i = 0; i < uniqueDates.length; i++) {
    if (i === 0) {
      if (differenceInDays(now, uniqueDates[0]) <= 1) streak = 1; else break;
    } else {
      if (differenceInDays(uniqueDates[i - 1], uniqueDates[i]) === 1) streak++; else break;
    }
  }

  return {
    totalWorkouts: completed.length,
    totalDurationSeconds,
    currentStreak: streak,
    longestStreak: streak,
    weeklyWorkouts,
    monthlyWorkouts,
  };
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function getWeeklyData(sessions: WorkoutSession[]): number[] {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  return [0, 1, 2, 3, 4, 5, 6].map(d => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + d);
    return sessions.filter(s => {
      if (s.status !== 'completed') return false;
      const sd = parseISO(s.startedAt);
      return sd.getDate() === day.getDate() &&
        sd.getMonth() === day.getMonth() &&
        sd.getFullYear() === day.getFullYear();
    }).length;
  });
}

export function getMotivationalQuote(): string {
  const quotes = [
    'Progress is earned, not given.',
    'Every set counts.',
    'Show up. Every time.',
    'Discipline outlasts motivation.',
    'Stronger than yesterday.',
    'The work is the reward.',
    'Consistency beats intensity.',
    'Build the body. Build the mind.',
  ];
  return quotes[new Date().getDay() % quotes.length];
}