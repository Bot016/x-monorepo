import { TextInput, TextInputProps, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

type LoginInputProps = TextInputProps & {
iconName: string;
rightIconName?: string;
onRightIconPress?: () => void;
};

export function LoginInput({
iconName,
rightIconName,
onRightIconPress,
...textInputProps
}: LoginInputProps) {
const colorScheme = useColorScheme();
const isDark = colorScheme === 'dark';

const backgroundColor = useThemeColor(
    { light: '#FFFFFF', dark: '#1C1C1E' },
    'background'
);
const textColor = useThemeColor({}, 'text');
const iconColor = isDark ? '#8E8E93' : '#AABAC8';
const borderColor = isDark ? '#38383A' : '#DDE4EE';
const placeholderColor = isDark ? '#636366' : '#AABAC8';

return (
    <ThemedView
    style={[
        styles.wrapper,
        {
        backgroundColor,
        borderColor,
        },
    ]}
    >
    <IconSymbol
        name={iconName as any}
        size={16}
        color={iconColor}
        style={styles.leftIcon}
    />
    <TextInput
        style={[styles.input, { color: textColor }]}
        placeholderTextColor={placeholderColor}
        {...textInputProps}
    />
    {rightIconName && onRightIconPress && (
        <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconBtn}>
        <IconSymbol name={rightIconName as any} size={16} color={iconColor} />
        </TouchableOpacity>
    )}
    </ThemedView>
);
}

const styles = StyleSheet.create({
wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,
},
leftIcon: {
    marginRight: 10,
},
input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
},
rightIconBtn: {
    paddingLeft: 10,
},
});