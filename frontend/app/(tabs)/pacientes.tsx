import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PacientesScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Pacientes</ThemedText>
      <ThemedText style={styles.subtitle}>
        A listagem de pacientes será implementada em breve.
      </ThemedText>
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
