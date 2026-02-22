import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useStore } from '../store';

export function useHaptics() {
  const hapticFeedback = useStore(s => s.settings.hapticFeedback);

  const impact = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    if (!hapticFeedback || Platform.OS === 'web') return;
    Haptics.impactAsync(style);
  };

  const notification = (type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType.Success) => {
    if (!hapticFeedback || Platform.OS === 'web') return;
    Haptics.notificationAsync(type);
  };

  const selection = () => {
    if (!hapticFeedback || Platform.OS === 'web') return;
    Haptics.selectionAsync();
  };

  return { impact, notification, selection };
}