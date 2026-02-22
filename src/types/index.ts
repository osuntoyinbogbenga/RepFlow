export interface User {
  id: string;
  name: string;
  fitnessGoal: 'strength' | 'hypertrophy' | 'endurance' | 'general';
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  category: ExerciseCategory;
  notes?: string;
}

export type MuscleGroup =
  | 'chest' | 'back' | 'shoulders' | 'biceps'
  | 'triceps' | 'legs' | 'glutes' | 'core' | 'full_body';

export type ExerciseCategory = 'compound' | 'isolation' | 'cardio' | 'bodyweight';

export interface WorkoutExercise {
  exerciseId: string;
  exercise: Exercise;
  sets: PlannedSet[];
  order: number;
  restSeconds: number;
}

export interface PlannedSet {
  reps: number;
  weight: number;
  weightUnit: 'kg' | 'lbs';
}

export interface WorkoutPlan {
  id: string;
  name: string;
  type: WorkoutType;
  exercises: WorkoutExercise[];
  scheduledDays: DayOfWeek[];
  createdAt: string;
  updatedAt: string;
  color: string;
}

export type WorkoutType = 'push' | 'pull' | 'legs' | 'full_body' | 'upper' | 'lower' | 'custom';
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface WorkoutSession {
  id: string;
  planId: string;
  planName: string;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  exerciseLogs: ExerciseLog[];
  notes?: string;
  status: 'active' | 'completed' | 'abandoned';
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: CompletedSet[];
  order: number;
}

export interface CompletedSet {
  setNumber: number;
  reps: number;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  completedAt: string;
}

export interface ScheduleSettings {
  gymDays: DayOfWeek[];
  preferredTime: string;
  reminderEnabled: boolean;
  reminderMinutesBefore: number;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  weightUnit: 'kg' | 'lbs';
  hapticFeedback: boolean;
  reduceMotion: boolean;
}

export interface ProgressStats {
  totalWorkouts: number;
  totalDurationSeconds: number;
  currentStreak: number;
  longestStreak: number;
  weeklyWorkouts: number;
  monthlyWorkouts: number;
}