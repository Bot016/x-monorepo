import { TouchableOpacity, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';;
import { useThemeColor } from '@/hooks/use-theme-color';

type LoginButtonProps = {
onPress: () => void;
label?: string;
};

export function LoginButton({ onPress, label = 'Entrar' }: LoginButtonProps) {
const tint = useThemeColor({}, "corBotao");

return (
    <TouchableOpacity
    style={[styles.button, { backgroundColor: tint }]}
    onPress={onPress}
    activeOpacity={0.85}
    >
    <ThemedText style={styles.label}>{label}</ThemedText>
    <IconSymbol name="arrow.right.circle.fill" size={20} color="#FFFFFF" />
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
});