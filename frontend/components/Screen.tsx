import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';

import { TopAppBar, type TopAppBarProps } from '@/components/TopAppBar';
import { useThemeColor } from '@/hooks/use-theme-color';

export type TopAppBarConfig = TopAppBarProps;

type ScreenProps = {
  children: ReactNode;
  withTabBar?: boolean;
  topAppBar?: boolean | TopAppBarConfig;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
};

function resolveTopAppBarConfig(
  topAppBar: boolean | TopAppBarConfig | undefined,
): TopAppBarConfig | null {
  if (!topAppBar) return null;
  if (topAppBar === true) return { variant: 'menu' };
  return { variant: 'menu', ...topAppBar };
}

export function Screen({
  children,
  withTabBar = false,
  topAppBar = false,
  backgroundColor,
  style,
}: ScreenProps) {
  const themeBackground = useThemeColor({}, 'pageBackground');
  const topAppBarConfig = resolveTopAppBarConfig(topAppBar);
  const edges: Edge[] = withTabBar
    ? ['top', 'left', 'right']
    : ['top', 'left', 'right', 'bottom'];

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: backgroundColor ?? themeBackground }]}
      edges={edges}
    >
      {topAppBarConfig ? (
        <View style={styles.topAppBarSlot}>
          <TopAppBar {...topAppBarConfig} />
        </View>
      ) : null}
      <View style={[styles.content, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
  },
  topAppBarSlot: {
    alignSelf: 'stretch',
    width: '100%',
  },
  content: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%',
  },
});
