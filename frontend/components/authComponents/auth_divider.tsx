import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

type AuthDividerProps = {
  label?: string;
};

export function AuthDivider({ label = 'ou' }: AuthDividerProps) {
  const lineColor = useThemeColor({}, 'cardBorder');
  const labelColor = useThemeColor({}, 'label');

  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: lineColor }]} />
      <ThemedText style={[styles.label, { color: labelColor }]}>{label}</ThemedText>
      <View style={[styles.line, { backgroundColor: lineColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
});
