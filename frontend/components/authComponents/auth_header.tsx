import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function LoginHeader() {
const colorScheme = useColorScheme();

return (
    <ThemedView lightColor="#FFFFFF" darkColor="#FFFFFF" style={styles.container}>
    <ThemedView
        lightColor="#DBEAFE"
        darkColor="#DBEAFE"
        style={styles.iconBox}
    >
        <IconSymbol
        name="cross.case.fill"
        size={28}
        color={Colors[colorScheme ?? 'light'].iconColor}
        />
    </ThemedView>
    <ThemedText
        type="title"
        lightColor="#0F172A"
        darkColor="#0F172A"
        style={styles.title}
    >
        Login Triagem X
    </ThemedText>
    </ThemedView>
);
}

export const AuthHeader = LoginHeader;

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