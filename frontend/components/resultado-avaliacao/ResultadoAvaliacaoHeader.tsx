import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export function ResultadoAvaliacaoHeader() {
  const titleColor = useThemeColor({}, 'text');

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={[styles.title, { color: titleColor }]}>
        Resultado da Avaliação
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});
