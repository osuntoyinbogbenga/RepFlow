import { useColorScheme } from 'react-native';
import { useStore } from '../store';
import { Colors } from '../constants/theme';

export function useTheme() {
  const settings = useStore(s => s.settings);
  const systemScheme = useColorScheme();
  const isDark = settings.theme === 'system' ? systemScheme === 'dark' : settings.theme === 'dark';
  return { colors: isDark ? Colors.dark : Colors.light, isDark };
}