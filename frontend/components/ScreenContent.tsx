import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { LAYOUT } from '@/constants/layout';

type ScreenContentProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  maxWidth?: number;
};

export function ScreenContent({
  children,
  style,
  maxWidth = LAYOUT.contentMaxWidth,
}: ScreenContentProps) {
  return <View style={[styles.content, { maxWidth }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    alignSelf: 'center',
  },
});
