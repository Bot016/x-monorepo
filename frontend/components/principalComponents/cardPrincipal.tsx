import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type CardPrincipalProps = {
label: string;
value: string;
icon: string;
valueColor?: string;
};

export function CardPrincipal({ label, value, icon, valueColor }: CardPrincipalProps) {
const colorScheme = useColorScheme();
const iconColor = Colors[colorScheme ?? 'light'].icon;
const defaultValueColor = Colors[colorScheme ?? 'light'].text;

return (
    <ThemedView style={styles.card}>
    <ThemedView style={styles.row}>
        <ThemedView style={styles.textBlock}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        <ThemedText style={[styles.value, { color: valueColor ?? defaultValueColor }]}>
            {value}
        </ThemedText>
        </ThemedView>
        <IconSymbol name={icon as any} size={32} color={iconColor} style={styles.icon} />
    </ThemedView>
    </ThemedView>
);
}

const styles = StyleSheet.create({
card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDE4EE',
    paddingHorizontal: 16,
    paddingVertical: 14,
},
row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},
textBlock: {
    gap: 4,
},
label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    opacity: 0.5,
},
value: {
    fontSize: 28,
    fontWeight: '700',
},
icon: {
    opacity: 0.15,
},
});