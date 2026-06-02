import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

export function LoginHeader() {
    const colorScheme = useColorScheme();
    const backgroundColor = useThemeColor({}, 'background');
    const titleColor = useThemeColor({}, 'text');
    const iconBoxColor = useThemeColor({}, 'iconBoxColor');

    return (
        <ThemedView lightColor={backgroundColor} darkColor={backgroundColor} style={styles.container}>
            <ThemedView
                lightColor={iconBoxColor}
                darkColor={iconBoxColor}
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
                style={[styles.title, { color: titleColor }]}
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