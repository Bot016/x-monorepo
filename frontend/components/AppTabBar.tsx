import { BottomTabBar, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function AppTabBar(props: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const bar = <BottomTabBar {...props} />;

  if (Platform.OS !== 'web') {
    return bar;
  }

  return (
    <View
      nativeID="app-tab-bar"
      style={[styles.webWrapper, { backgroundColor: theme.background }]}
    >
      {bar}
    </View>
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    width: '100%',
    alignSelf: 'stretch',
    flexShrink: 0,
    overflow: 'hidden',
  },
});
