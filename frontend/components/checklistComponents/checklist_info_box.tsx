import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

type ChecklistInfoBoxProps = {
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'error';
};

export function ChecklistInfoBox({
  title,
  message,
  type = 'info',
}: ChecklistInfoBoxProps) {
  const backgroundColor = {
    info: '#E0E7FF',
    warning: '#FEF3C7',
    error: '#FEE2E2',
  }[type];

  const borderColor = {
    info: '#818CF8',
    warning: '#F59E0B',
    error: '#F87171',
  }[type];

  const iconColor = {
    info: '#818CF8',
    warning: '#F59E0B',
    error: '#F87171',
  }[type];

  const iconName = {
    info: 'info.circle.fill',
    warning: 'exclamationmark.triangle.fill',
    error: 'xmark.circle.fill',
  }[type];

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      <IconSymbol
        name={iconName as any}
        size={20}
        color={iconColor}
        style={styles.icon}
      />
      <View style={styles.content}>
        <ThemedText style={[styles.title, { color: iconColor }]}>
          {title}
        </ThemedText>
        <ThemedText style={[styles.message, { color: iconColor }]}>
          {message}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    marginVertical: 12,
  },
  icon: {
    marginTop: 2,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
  },
  message: {
    fontSize: 12,
    lineHeight: 16,
  },
});
