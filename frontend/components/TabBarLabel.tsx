import { Platform, StyleSheet, Text } from 'react-native';

type TabBarLabelProps = {
  color: string;
  children: string;
};

export function TabBarLabel({ color, children }: TabBarLabelProps) {
  return (
    <Text
      numberOfLines={1}
      allowFontScaling={false}
      style={[styles.label, { color }, Platform.OS === 'web' && styles.labelWeb]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 2,
  },
  labelWeb: {
    marginTop: 4,
    paddingBottom: 2,
    overflow: 'visible',
  },
});
