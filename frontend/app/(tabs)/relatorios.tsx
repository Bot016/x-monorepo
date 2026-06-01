import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function RelatoriosScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Relatórios</ThemedText>
      <ThemedText style={styles.subtitle}>Consulte e exporte relatórios da sua clínica.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 8,
  },
  subtitle: {
    opacity: 0.7,
  },
});
