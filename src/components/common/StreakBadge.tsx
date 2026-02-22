import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Radius } from '../../constants/theme';

export function StreakBadge({ streak }: { streak: number }) {
  const { colors } = useTheme();
  return (
    <MotiView
      from={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 15 }}
      style={[styles.container, {
        backgroundColor: streak > 0 ? colors.accentGlow : colors.borderSubtle,
        borderColor: streak > 0 ? colors.accent : colors.border,
      }]}
    >
      <Text style={{ fontSize: 14 }}>🔥</Text>
      <Text style={[Typography.smSemibold, { color: streak > 0 ? colors.accent : colors.textSecondary, marginLeft: 4 }]}>
        {streak} day streak
      </Text>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: Radius.full, borderWidth: 1, alignSelf: 'flex-start',
  },
});