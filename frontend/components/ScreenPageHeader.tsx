import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

type ScreenPageHeaderProps = {
  title: string;
  subtitle?: string;
  wide?: boolean;
  action?: ReactNode;
};

export function ScreenPageHeader({
  title,
  subtitle,
  wide = false,
  action,
}: ScreenPageHeaderProps) {
  const titleColor = useThemeColor({ light: '#0B1C30', dark: '#ECEDEE' }, 'text');
  const subtitleColor = useThemeColor({}, 'label');

  const textBlock = (
    <View style={styles.headerText}>
      <ThemedText style={[styles.title, { color: titleColor }]}>{title}</ThemedText>
      {subtitle ? (
        <ThemedText style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</ThemedText>
      ) : null}
    </View>
  );

  if (wide && action) {
    return (
      <View style={styles.headerRow}>
        {textBlock}
        {action}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {textBlock}
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 24,
  },
  headerText: {
    flex: 1,
    gap: 4,
    paddingRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});
