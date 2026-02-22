import React from 'react';
import { Text, ViewStyle, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PressableScale } from './PressableScale';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Radius } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({ title, onPress, variant = 'primary', size = 'md', disabled = false, style, leftIcon, fullWidth = false }: ButtonProps) {
  const { colors } = useTheme();
  const sizes = {
    sm: { py: 8, px: 16, fs: 13, r: Radius.sm },
    md: { py: 14, px: 20, fs: 15, r: Radius.md },
    lg: { py: 18, px: 28, fs: 17, r: Radius.lg },
  };
  const s = sizes[size];
  const row: ViewStyle = { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' };
  const fw: ViewStyle = fullWidth ? { width: '100%' } : {};

  if (variant === 'primary') {
    return (
      <PressableScale onPress={onPress} disabled={disabled}
        style={[{ borderRadius: s.r, overflow: 'hidden', opacity: disabled ? 0.5 : 1 }, fw, style]}>
        <LinearGradient colors={[colors.accent, colors.accentDim]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[row, { paddingVertical: s.py, paddingHorizontal: s.px }]}>
          {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
          <Text style={[Typography.bodySemibold, { color: '#fff', fontSize: s.fs }]}>{title}</Text>
        </LinearGradient>
      </PressableScale>
    );
  }
  if (variant === 'secondary') {
    return (
      <PressableScale onPress={onPress} disabled={disabled}
        style={[row, { paddingVertical: s.py, paddingHorizontal: s.px, borderRadius: s.r, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, opacity: disabled ? 0.5 : 1 }, fw, style]}>
        {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
        <Text style={[Typography.bodySemibold, { color: colors.text, fontSize: s.fs }]}>{title}</Text>
      </PressableScale>
    );
  }
  if (variant === 'danger') {
    return (
      <PressableScale onPress={onPress} disabled={disabled}
        style={[row, { paddingVertical: s.py, paddingHorizontal: s.px, borderRadius: s.r, backgroundColor: 'rgba(239,68,68,0.12)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)', opacity: disabled ? 0.5 : 1 }, fw, style]}>
        <Text style={[Typography.bodySemibold, { color: colors.error, fontSize: s.fs }]}>{title}</Text>
      </PressableScale>
    );
  }
  return (
    <PressableScale onPress={onPress} disabled={disabled}
      style={[row, { paddingVertical: s.py, paddingHorizontal: s.px, borderRadius: s.r, opacity: disabled ? 0.5 : 1 }, fw, style]}>
      {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
      <Text style={[Typography.bodySemibold, { color: colors.accent, fontSize: s.fs }]}>{title}</Text>
    </PressableScale>
  );
}