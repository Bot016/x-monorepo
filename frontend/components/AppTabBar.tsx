import { BottomTabBar, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LAYOUT } from '@/constants/layout';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function AppTabBar(props: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const isCompact = width < LAYOUT.tabBarCompactMaxWidth;
  const bottomPadding = Math.max(Platform.OS === 'web' ? 12 : 6, insets.bottom);
  const minHeight = (isCompact ? 58 : 62) + bottomPadding;

  const bar = (
    <BottomTabBar
      {...props}
      style={{
        minHeight,
        paddingTop: 8,
        paddingBottom: bottomPadding,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: theme.cardBorder,
        overflow: 'visible',
      }}
    />
  );

  if (Platform.OS !== 'web') {
    return bar;
  }

  return (
    <View nativeID="app-tab-bar" style={styles.webWrapper}>
      {bar}
    </View>
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    overflow: 'visible',
  },
});
