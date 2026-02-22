export const Colors = {
  dark: {
    bg: '#0D0D0F',
    bgSecondary: '#141418',
    bgCard: '#1A1A20',
    bgCardHover: '#1F1F27',
    border: '#252530',
    borderSubtle: '#1E1E26',
    accent: '#3D7BFF',
    accentDim: '#2A5AC4',
    accentGlow: 'rgba(61,123,255,0.15)',
    accentMuted: 'rgba(61,123,255,0.08)',
    success: '#22C55E',
    successMuted: 'rgba(34,197,94,0.12)',
    warning: '#F59E0B',
    error: '#EF4444',
    text: '#F2F2F5',
    textSecondary: '#8A8A9A',
    textTertiary: '#4A4A5A',
    textMuted: '#2E2E3A',
    white: '#FFFFFF',
    overlay: 'rgba(0,0,0,0.7)',
    tabBar: '#101013',
    tabBarBorder: '#1E1E26',
  },
  light: {
    bg: '#F8F8FC',
    bgSecondary: '#FFFFFF',
    bgCard: '#FFFFFF',
    bgCardHover: '#F2F2F8',
    border: '#E4E4EE',
    borderSubtle: '#EDEDF5',
    accent: '#2563EB',
    accentDim: '#1D4ED8',
    accentGlow: 'rgba(37,99,235,0.12)',
    accentMuted: 'rgba(37,99,235,0.06)',
    success: '#16A34A',
    successMuted: 'rgba(22,163,74,0.1)',
    warning: '#D97706',
    error: '#DC2626',
    text: '#0D0D1A',
    textSecondary: '#5A5A72',
    textTertiary: '#9A9AB0',
    textMuted: '#D4D4E0',
    white: '#FFFFFF',
    overlay: 'rgba(0,0,0,0.4)',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E4E4EE',
  },
};

export const Typography = {
  d1: { fontSize: 40, fontWeight: '800' as const, letterSpacing: -1.5 },
  d2: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -1 },
  d3: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.5 },
  h1: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  h2: { fontSize: 18, fontWeight: '600' as const, letterSpacing: -0.2 },
  h3: { fontSize: 16, fontWeight: '600' as const, letterSpacing: -0.1 },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyMedium: { fontSize: 15, fontWeight: '500' as const },
  bodySemibold: { fontSize: 15, fontWeight: '600' as const },
  sm: { fontSize: 13, fontWeight: '400' as const },
  smMedium: { fontSize: 13, fontWeight: '500' as const },
  smSemibold: { fontSize: 13, fontWeight: '600' as const },
  xs: { fontSize: 11, fontWeight: '400' as const, letterSpacing: 0.3 },
  xsMedium: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.3 },
  xsCaps: { fontSize: 10, fontWeight: '600' as const, letterSpacing: 1.2 },
  numLarge: { fontSize: 36, fontWeight: '800' as const, letterSpacing: -1 },
  numMedium: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.5 },
};

export const Spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, screen: 20,
};

export const Radius = {
  sm: 8, md: 12, lg: 16, xl: 20, full: 9999,
};

export const Shadows = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 16, elevation: 8 },
  accent: (color: string) => ({ shadowColor: color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 }),
};

export const WorkoutTypeColors: Record<string, string> = {
  push: '#3D7BFF', pull: '#8B5CF6', legs: '#10B981',
  full_body: '#F59E0B', upper: '#EC4899', lower: '#06B6D4', custom: '#6B7280',
};

export const MuscleGroupLabels: Record<string, string> = {
  chest: 'Chest', back: 'Back', shoulders: 'Shoulders', biceps: 'Biceps',
  triceps: 'Triceps', legs: 'Legs', glutes: 'Glutes', core: 'Core', full_body: 'Full Body',
};