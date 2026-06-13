import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

type HeaderActionButtonProps = {
  label: string;
  onPress: () => void;
  icon?: string;
  loading?: boolean;
  fullWidth?: boolean;
};

export function HeaderActionButton({
  label,
  onPress,
  icon,
  loading = false,
  fullWidth = true,
}: HeaderActionButtonProps) {
  const buttonColor = useThemeColor({}, 'buttonColor');
  const onPrimaryColor = useThemeColor({}, 'onPrimary');

  return (
    <TouchableOpacity
      style={[
        styles.button,
        fullWidth ? styles.buttonFullWidth : styles.buttonCompact,
        { backgroundColor: buttonColor },
        loading && styles.buttonDisabled,
      ]}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={onPrimaryColor} size="small" />
      ) : icon ? (
        <IconSymbol name={icon as never} size={18} color={onPrimaryColor} />
      ) : null}
      <ThemedText style={[styles.label, { color: onPrimaryColor }]}>{label}</ThemedText>
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
    gap: 8,
  },
  buttonFullWidth: {
    alignSelf: 'stretch',
  },
  buttonCompact: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
  },
  buttonDisabled: {
    opacity: 0.85,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
