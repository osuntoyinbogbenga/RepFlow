import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Radius } from '../../constants/theme';
import { useStore } from '../../store';

const MAX_H = 80;
const LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function BarItem({ value, percentage, label, isToday, colors, delay, reduceMotion }: any) {
  const height = useSharedValue(reduceMotion ? percentage : 0);

  useEffect(() => {
    height.value = withDelay(delay, withTiming(percentage, { duration: 500, easing: Easing.out(Easing.cubic) }));
  }, [percentage]);

  const animStyle = useAnimatedStyle(() => ({ height: height.value * MAX_H }));

  return (
    <View style={styles.barWrapper}>
      <View style={styles.barTrack}>
        <Animated.View style={[styles.bar, animStyle, {
          backgroundColor: isToday ? colors.accent : value > 0 ? colors.accent + '60' : colors.borderSubtle,
          borderRadius: Radius.sm,
        }]} />
      </View>
      <Text style={[Typography.xsCaps, { color: isToday ? colors.accent : colors.textSecondary, marginTop: 6 }]}>
        {label}
      </Text>
    </View>
  );
}

export function WeeklyChart({ data }: { data: number[] }) {
  const { colors } = useTheme();
  const reduceMotion = useStore(s => s.settings.reduceMotion);
  const max = Math.max(...data, 1);
  const today = (new Date().getDay() + 6) % 7;

  return (
    <View style={styles.bars}>
      {data.map((val, i) => (
        <BarItem key={i} value={val} percentage={Math.min(val / max, 1)} label={LABELS[i]}
          isToday={i === today} colors={colors} delay={i * 60} reduceMotion={reduceMotion} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: MAX_H + 32 },
  barWrapper: { flex: 1, alignItems: 'center' },
  barTrack: { width: '60%', height: MAX_H, justifyContent: 'flex-end' },
  bar: { width: '100%', minHeight: 3 },
});