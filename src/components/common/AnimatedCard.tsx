import React, { ReactNode, useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withDelay, withSpring, Easing } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Shadows } from '../../constants/theme';
import { useStore } from '../../store';

interface Props {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  delay?: number;
  shadow?: 'sm' | 'md' | 'lg' | 'none';
}

export function AnimatedCard({ children, style, delay = 0, shadow = 'md' }: Props) {
  const { colors } = useTheme();
  const reduceMotion = useStore(s => s.settings.reduceMotion);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const translateY = useSharedValue(reduceMotion ? 0 : 16);

  useEffect(() => {
    if (reduceMotion) return;
    opacity.value = withDelay(delay, withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 180 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const shadowStyle = shadow !== 'none' ? Shadows[shadow] : {};

  return (
    <Animated.View style={[
      { backgroundColor: colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: colors.border, ...shadowStyle },
      animStyle,
      style,
    ]}>
      {children}
    </Animated.View>
  );
}