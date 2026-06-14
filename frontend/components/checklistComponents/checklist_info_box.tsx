import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

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
  const infoBackground = useThemeColor({}, 'infoBoxInfoBackground');
  const warningBackground = useThemeColor({}, 'infoBoxWarningBackground');
  const errorBackground = useThemeColor({}, 'infoBoxErrorBackground');
  const infoAccent = useThemeColor({}, 'infoBoxInfoAccent');
  const warningAccent = useThemeColor({}, 'infoBoxWarningAccent');
  const errorAccent = useThemeColor({}, 'infoBoxErrorAccent');

  const backgroundColor = {
    info: infoBackground,
    warning: warningBackground,
    error: errorBackground,
  }[type];

  const accentColor = {
    info: infoAccent,
    warning: warningAccent,
    error: errorAccent,
  }[type];

  const iconName = {
    info: 'info.circle.fill',
    warning: 'exclamationmark.triangle.fill',
    error: 'xmark.circle.fill',
  }[type];

  return (
    <View style={[styles.container, { backgroundColor, borderColor: accentColor }]}>
      <IconSymbol
        name={iconName as never}
        size={20}
        color={accentColor}
        style={styles.icon}
      />
      <View style={styles.content}>
        <ThemedText style={[styles.title, { color: accentColor }]}>
          {title}
        </ThemedText>
        <ThemedText style={[styles.message, { color: accentColor }]}>
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
