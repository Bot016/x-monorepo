import type { ReactNode } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, useWindowDimensions, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LAYOUT } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';

type BottomSheetFrameProps = {
  children: ReactNode;
  onClose: () => void;
  style?: StyleProp<ViewStyle>;
};

export function BottomSheetFrame({ children, onClose, style }: BottomSheetFrameProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const sheetBackground = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'cardBorder');
  const overlayColor = useThemeColor({}, 'overlay');
  const isWeb = Platform.OS === 'web';
  const isCentered = isWeb && width >= LAYOUT.statsRowMinWidth;

  return (
    <View
      style={[
        styles.overlay,
        isWeb && { minHeight: height || Dimensions.get('window').height },
        isCentered && styles.overlayCentered,
      ]}
    >
      <Pressable
        style={[styles.backdrop, { backgroundColor: overlayColor }]}
        onPress={onClose}
        accessibilityLabel="Fechar"
      />

      <View style={[styles.sheetSlot, isCentered && styles.sheetSlotCentered]}>
        <View
          style={[
            styles.sheet,
            isCentered ? styles.sheetCentered : styles.sheetBottom,
            {
              backgroundColor: sheetBackground,
              borderColor,
              paddingBottom: Math.max(insets.bottom, 16),
            },
            style,
          ]}
        >
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  overlayCentered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetSlot: {
    width: '100%',
    alignItems: 'center',
  },
  sheetSlotCentered: {
    width: '100%',
    maxWidth: LAYOUT.sheetMaxWidth,
  },
  sheet: {
    width: '100%',
    maxWidth: LAYOUT.sheetMaxWidth,
  },
  sheetBottom: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
  },
  sheetCentered: {
    borderRadius: 16,
    borderWidth: 1,
  },
});
