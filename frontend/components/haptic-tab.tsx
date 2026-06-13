import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Platform, StyleSheet } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  const { style, ...rest } = props;

  return (
    <PlatformPressable
      {...rest}
      style={[style, Platform.OS === 'web' && styles.webTab]}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}

const styles = StyleSheet.create({
  webTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    minHeight: 52,
    paddingVertical: 6,
  },
});
