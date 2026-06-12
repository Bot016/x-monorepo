import {
  Platform,
  StyleSheet,
  TextInput,
  type TextInputProps,
  type TextStyle,
  TouchableOpacity,
} from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

type FormInputProps = TextInputProps & {
  iconName?: string;
  rightIconName?: string;
  onRightIconPress?: () => void;
};

export function FormInput({
  iconName,
  rightIconName,
  onRightIconPress,
  style,
  ...textInputProps
}: FormInputProps) {
  const backgroundColor = useThemeColor({}, 'inputBackground');
  const borderColor = useThemeColor({}, 'inputBorder');
  const iconColor = useThemeColor({}, 'icon');
  const textColor = useThemeColor({}, 'inputText');
  const themePlaceholderTextColor = useThemeColor({}, 'placeholderTextColor');
  const placeholderTextColor = textInputProps.placeholderTextColor ?? themePlaceholderTextColor;

  return (
    <ThemedView
      lightColor={backgroundColor}
      darkColor={backgroundColor}
      style={[styles.wrapper, { borderColor }]}
    >
      {iconName ? (
        <IconSymbol
          name={iconName as never}
          size={16}
          color={iconColor}
          style={styles.leftIcon}
        />
      ) : null}
      <TextInput
        style={[styles.input, Platform.OS === 'web' && inputWebStyle, { color: textColor }, style]}
        placeholderTextColor={placeholderTextColor}
        {...textInputProps}
      />
      {rightIconName && onRightIconPress ? (
        <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconBtn}>
          <IconSymbol name={rightIconName as never} size={16} color={iconColor} />
        </TouchableOpacity>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
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
    backgroundColor: 'transparent',
  },
  rightIconBtn: {
    paddingLeft: 10,
  },
});

const inputWebStyle = {
  outlineStyle: 'none',
  outlineWidth: 0,
} as unknown as TextStyle;
