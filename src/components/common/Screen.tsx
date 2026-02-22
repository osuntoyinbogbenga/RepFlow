import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing } from '../../constants/theme';

interface Props {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  scrollable?: boolean;
  rightAction?: ReactNode;
  noPadding?: boolean;
}

export function Screen({ children, title, subtitle, scrollable = true, rightAction, noPadding = false }: Props) {
  const { colors, isDark } = useTheme();
  const Container: any = scrollable ? ScrollView : View;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />
      {(title || subtitle) && (
        <View style={[styles.header, { borderBottomColor: colors.borderSubtle }]}>
          <View style={{ flex: 1 }}>
            {subtitle && <Text style={[Typography.xsCaps, { color: colors.accent, marginBottom: 2 }]}>{subtitle.toUpperCase()}</Text>}
            {title && <Text style={[Typography.h1, { color: colors.text }]}>{title}</Text>}
          </View>
          {rightAction && <View>{rightAction}</View>}
        </View>
      )}
      <Container
        style={{ flex: 1 }}
        contentContainerStyle={noPadding ? undefined : { paddingHorizontal: Spacing.screen, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});