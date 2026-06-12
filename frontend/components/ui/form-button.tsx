import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

type FormButtonProps = {
  onPress: () => void;
  label: string;
  disabled?: boolean;
  showIcon?: boolean;
};

export function FormButton({
  onPress,
  label,
  disabled = false,
  showIcon = true,
}: FormButtonProps) {
  const colorScheme = useColorScheme();
  const buttonColor = useThemeColor({}, 'buttonColor');
  const iconColor = Colors[colorScheme ?? 'light'].background;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: buttonColor },
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
    >
      <ThemedText style={styles.label}>{label}</ThemedText>
      {showIcon ? (
        <IconSymbol name="arrow.right.circle.fill" size={20} color={iconColor} />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 52,
    marginTop: 24,
    gap: 8,
    shadowColor: '#1A56DB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
