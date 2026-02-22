import React, { ReactNode } from 'react';
import { Pressable, ViewStyle, Platform } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useStore } from '../../store';

interface Props {
  children: ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  activeScale?: number;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PressableScale({ children, onPress, onLongPress, style, activeScale = 0.97, disabled = false }: Props) {
  const scale = useSharedValue(1);
  const hapticFeedback = useStore(s => s.settings.hapticFeedback);
  const reduceMotion = useStore(s => s.settings.reduceMotion);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        if (disabled) return;
        if (hapticFeedback && Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.();
      }}
      onLongPress={onLongPress}
      onPressIn={() => {
        if (!reduceMotion) scale.value = withSpring(activeScale, { damping: 15, stiffness: 400 });
      }}
      onPressOut={() => {
        if (!reduceMotion) scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      }}
      style={[animatedStyle, style]}
      disabled={disabled}
    >
      {children}
    </AnimatedPressable>
  );
}