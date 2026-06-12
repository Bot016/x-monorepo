import { TouchableOpacity, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

type Props = {
  onPress: () => void;
  fullWidth?: boolean;
};

export function NovaAvaliacaoButton({ onPress, fullWidth = true }: Props) {
  const corBotao = useThemeColor({}, 'buttonColor');

  return (
    <TouchableOpacity
      style={[
        styles.button,
        fullWidth ? styles.buttonFullWidth : styles.buttonCompact,
        { backgroundColor: corBotao },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
    <IconSymbol name="plus.circle.fill" size={20} color="#FFFFFF" />
    <ThemedText lightColor="#FFFFFF" darkColor="#FFFFFF" style={styles.label}>
        Nova Avaliação
    </ThemedText>
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
    shadowColor: '#00478D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonFullWidth: {
    alignSelf: 'stretch',
  },
  buttonCompact: {
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
});