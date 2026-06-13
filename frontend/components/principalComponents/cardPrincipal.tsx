import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';
import { displayNumberStyle } from '@/utils/displayText';

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
const cardBorderColor = useThemeColor({}, 'cardBorder');

return (
    <ThemedView style={[styles.card, { borderColor: cardBorderColor }]}>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    overflow: 'visible',
},
row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
},
textBlock: {
    gap: 4,
    overflow: 'visible',
},
label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    opacity: 0.5,
},
value: displayNumberStyle(28),
icon: {
    opacity: 0.15,
},
});