import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

type AuthOutlineButtonProps = {
  label: string;
  onPress: () => void;
};

export function AuthOutlineButton({ label, onPress }: AuthOutlineButtonProps) {
  const borderColor = useThemeColor({}, 'cardBorder');
  const textColor = useThemeColor({}, 'buttonColor');

  return (
    <TouchableOpacity
      style={[styles.button, { borderColor }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <ThemedText style={[styles.label, { color: textColor }]}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
