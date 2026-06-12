import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAsyncList } from '@/hooks/useAsyncList';
import { listPatients } from '@/services/patients';
import type { PatientDto } from '@/services/types/api';
import { ageFromBirthDate } from '@/utils/patient';

export default function PacientesScreen() {
  const { items: patients, isLoading, isRefreshing, errorMessage, reload } = useAsyncList(
    listPatients,
    { errorMessage: 'Não foi possível carregar os pacientes.' },
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Pacientes</ThemedText>
      <ThemedText style={styles.subtitle}>
        Pacientes cadastrados e avaliados por você.
      </ThemedText>

      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}

      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => void reload(true)} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <ThemedText style={styles.empty}>
            Nenhum paciente cadastrado ainda.
          </ThemedText>
        }
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.8}>
            <ThemedView style={styles.card}>
              <ThemedText style={styles.patientName}>{item.name}</ThemedText>
              <ThemedText style={styles.patientMeta}>
                {item.sex === 'm' ? 'Masculino' : 'Feminino'} · {ageFromBirthDate(item.birthDate)} anos
              </ThemedText>
              {item.guardian?.name ? (
                <ThemedText style={styles.guardian}>
                  Responsável: {item.guardian.name}
                </ThemedText>
              ) : null}
            </ThemedView>
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 8,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: 8,
  },
  list: {
    gap: 10,
    paddingBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: '#DDE4EE',
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
  },
  patientMeta: {
    fontSize: 13,
    opacity: 0.7,
  },
  guardian: {
    fontSize: 12,
    opacity: 0.6,
  },
  empty: {
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 24,
  },
  error: {
    color: '#DC2626',
    fontSize: 14,
  },
});
