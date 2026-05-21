import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function LoginHeader() {
const colorScheme = useColorScheme();
const isDark = colorScheme === 'dark';

return (
    <ThemedView style={styles.container}>
    <ThemedView
        style={[
        styles.iconBox,
        { backgroundColor: isDark ? '#1E3A5F' : '#DBEAFE' },
        ]}
    >
        <IconSymbol
        name="cross.case.fill"
        size={28}
        color={Colors[colorScheme ?? 'light'].tint}
        />
    </ThemedView>
    <ThemedText type="title" style={styles.title}>
        Login Triagem X
    </ThemedText>
    </ThemedView>
);
}

const styles = StyleSheet.create({
container: {
    alignItems: 'center',
    marginBottom: 40,
    gap: 16,
},
iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
},
title: {
    textAlign: 'center',
},
});