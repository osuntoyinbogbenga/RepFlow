import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { MotiView } from 'moti';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../common/Button';
import { useRestTimer } from '../../hooks/useWorkoutTimer';
import { Typography } from '../../constants/theme';

interface Props {
  visible: boolean;
  seconds: number;
  onComplete: () => void;
  onSkip: () => void;
}

const SIZE = 200, STROKE = 10, R = (SIZE - STROKE) / 2, CIRC = 2 * Math.PI * R;

export function RestTimer({ visible, seconds, onComplete, onSkip }: Props) {
  const { colors } = useTheme();
  const { formatted, progress, skip } = useRestTimer(seconds, onComplete);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <MotiView
          from={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 18 }}
          style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
        >
          <Text style={[Typography.smSemibold, { color: colors.textSecondary, letterSpacing: 1.5 }]}>REST</Text>
          <View style={{ marginVertical: 24, alignItems: 'center' }}>
            <Svg width={SIZE} height={SIZE}>
              <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke={colors.border} strokeWidth={STROKE} fill="none" />
              <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke={colors.accent} strokeWidth={STROKE} fill="none"
                strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - progress)}
                strokeLinecap="round" transform={`rotate(-90, ${SIZE / 2}, ${SIZE / 2})`} />
            </Svg>
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={[Typography.numLarge, { color: colors.text }]}>{formatted}</Text>
                <Text style={[Typography.sm, { color: colors.textSecondary, marginTop: 4 }]}>seconds</Text>
              </View>
            </View>
          </View>
          <Button title="Skip Rest" variant="ghost" onPress={() => { skip(); onSkip(); }} />
        </MotiView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { borderRadius: 24, borderWidth: 1, padding: 32, alignItems: 'center', width: '100%', maxWidth: 360 },
});