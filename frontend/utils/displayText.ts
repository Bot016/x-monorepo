import { Platform, type TextStyle } from 'react-native';

export function displayNumberStyle(fontSize: number): TextStyle {
  return {
    fontSize,
    fontWeight: '700',
    lineHeight: Math.round(fontSize * 1.3),
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  };
}
