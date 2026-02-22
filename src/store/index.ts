import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutPlan, WorkoutSession, User, AppSettings, ScheduleSettings, Exercise } from '../types';
import { SAMPLE_WORKOUT_PLANS, DEFAULT_EXERCISES } from '../constants/exercises';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  PLANS: 'repflow:plans',
  SESSIONS: 'repflow:sessions',
  USER: 'repflow:user',
  SETTINGS: 'repflow:settings',
  SCHEDULE: 'repflow:schedule',
  EXERCISES: 'repflow:exercises',
};

interface ActiveSessionState {
  session: WorkoutSession | null;
  plan: WorkoutPlan | null;
  currentExerciseIndex: number;
  currentSetIndex: number;
  isPaused: boolean;
  isResting: boolean;
  restSecondsRemaining: number;
}

interface AppState {
  user: User | null;
  workoutPlans: WorkoutPlan[];
  sessions: WorkoutSession[];
  exercises: Exercise[];
  settings: AppSettings;
  schedule: ScheduleSettings;
  activeSession: ActiveSessionState;
  isLoaded: boolean;
  initialize: () => Promise<void>;
  saveUser: (user: User) => Promise<void>;
  saveSettings: (settings: Partial<AppSettings>) => Promise<void>;
  saveSchedule: (schedule: Partial<ScheduleSettings>) => Promise<void>;
  addPlan: (plan: Omit<WorkoutPlan, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePlan: (id: string, plan: Partial<WorkoutPlan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  startSession: (plan: WorkoutPlan) => void;
  completeSet: (exerciseIndex: number, setIndex: number, data: { reps: number; weight: number }) => void;
  nextExercise: () => void;
  togglePause: () => void;
  startRest: (seconds: number) => void;
  stopRest: () => void;
  endSession: () => Promise<void>;
  abandonSession: () => void;
  exportData: () => string;
  resetAllData: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  theme: 'dark', weightUnit: 'kg', hapticFeedback: true, reduceMotion: false,
};

const defaultSchedule: ScheduleSettings = {
  gymDays: [1, 3, 5], preferredTime: '07:00', reminderEnabled: true, reminderMinutesBefore: 30,
};

const emptyActiveSession: ActiveSessionState = {
  session: null, plan: null, currentExerciseIndex: 0,
  currentSetIndex: 0, isPaused: false, isResting: false, restSecondsRemaining: 0,
};

export const useStore = create<AppState>((set, get) => ({
  user: null,
  workoutPlans: [],
  sessions: [],
  exercises: DEFAULT_EXERCISES,
  settings: defaultSettings,
  schedule: defaultSchedule,
  isLoaded: false,
  activeSession: emptyActiveSession,

  initialize: async () => {
    try {
      const [plansRaw, sessionsRaw, userRaw, settingsRaw, scheduleRaw] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PLANS),
        AsyncStorage.getItem(STORAGE_KEYS.SESSIONS),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
        AsyncStorage.getItem(STORAGE_KEYS.SCHEDULE),
      ]);
      const plans = plansRaw ? JSON.parse(plansRaw) : SAMPLE_WORKOUT_PLANS;
      if (!plansRaw) await AsyncStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(SAMPLE_WORKOUT_PLANS));
      set({
        workoutPlans: plans,
        sessions: sessionsRaw ? JSON.parse(sessionsRaw) : [],
        user: userRaw ? JSON.parse(userRaw) : { id: uuidv4(), name: 'Athlete', fitnessGoal: 'general', createdAt: new Date().toISOString() },
        settings: settingsRaw ? { ...defaultSettings, ...JSON.parse(settingsRaw) } : defaultSettings,
        schedule: scheduleRaw ? { ...defaultSchedule, ...JSON.parse(scheduleRaw) } : defaultSchedule,
        isLoaded: true,
      });
    } catch (e) {
      set({ isLoaded: true });
    }
  },

  saveUser: async (user) => {
    set({ user });
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  saveSettings: async (newSettings) => {
    const settings = { ...get().settings, ...newSettings };
    set({ settings });
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  saveSchedule: async (newSchedule) => {
    const schedule = { ...get().schedule, ...newSchedule };
    set({ schedule });
    await AsyncStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
  },

  addPlan: async (planData) => {
    const plan: WorkoutPlan = { ...planData, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const plans = [...get().workoutPlans, plan];
    set({ workoutPlans: plans });
    await AsyncStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  },

  updatePlan: async (id, updates) => {
    const plans = get().workoutPlans.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p);
    set({ workoutPlans: plans });
    await AsyncStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  },

  deletePlan: async (id) => {
    const plans = get().workoutPlans.filter(p => p.id !== id);
    set({ workoutPlans: plans });
    await AsyncStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  },

  startSession: (plan) => {
    const session: WorkoutSession = {
      id: uuidv4(), planId: plan.id, planName: plan.name,
      startedAt: new Date().toISOString(), durationSeconds: 0, status: 'active',
      exerciseLogs: plan.exercises.map((we, i) => ({
        exerciseId: we.exerciseId, exerciseName: we.exercise.name, sets: [], order: i,
      })),
    };
    set({ activeSession: { session, plan, currentExerciseIndex: 0, currentSetIndex: 0, isPaused: false, isResting: false, restSecondsRemaining: 0 } });
  },

  completeSet: (exerciseIndex, setIndex, data) => {
    const { activeSession } = get();
    if (!activeSession.session) return;
    const session = { ...activeSession.session };
    const logs = [...session.exerciseLogs];
    const log = { ...logs[exerciseIndex] };
    const sets = [...log.sets];
    sets[setIndex] = { setNumber: setIndex + 1, reps: data.reps, weight: data.weight, weightUnit: get().settings.weightUnit, completedAt: new Date().toISOString() };
    log.sets = sets;
    logs[exerciseIndex] = log;
    session.exerciseLogs = logs;
    set({ activeSession: { ...activeSession, session, currentSetIndex: setIndex + 1 } });
  },

  nextExercise: () => {
    const { activeSession } = get();
    set({ activeSession: { ...activeSession, currentExerciseIndex: activeSession.currentExerciseIndex + 1, currentSetIndex: 0 } });
  },

  togglePause: () => {
    const { activeSession } = get();
    set({ activeSession: { ...activeSession, isPaused: !activeSession.isPaused } });
  },

  startRest: (seconds) => {
    const { activeSession } = get();
    set({ activeSession: { ...activeSession, isResting: true, restSecondsRemaining: seconds } });
  },

  stopRest: () => {
    const { activeSession } = get();
    set({ activeSession: { ...activeSession, isResting: false, restSecondsRemaining: 0 } });
  },

  endSession: async () => {
    const { activeSession, sessions } = get();
    if (!activeSession.session) return;
    const session: WorkoutSession = { ...activeSession.session, endedAt: new Date().toISOString(), status: 'completed' };
    const updatedSessions = [session, ...sessions];
    set({ sessions: updatedSessions, activeSession: emptyActiveSession });
    await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updatedSessions));
  },

  abandonSession: () => set({ activeSession: emptyActiveSession }),

  exportData: () => {
    const { workoutPlans, sessions, user, settings } = get();
    return JSON.stringify({ user, workoutPlans, sessions, settings, exportedAt: new Date().toISOString() }, null, 2);
  },

  resetAllData: async () => {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    set({ user: null, workoutPlans: SAMPLE_WORKOUT_PLANS, sessions: [], exercises: DEFAULT_EXERCISES, settings: defaultSettings, schedule: defaultSchedule });
    await AsyncStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(SAMPLE_WORKOUT_PLANS));
  },
}));