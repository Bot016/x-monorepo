import { ScrollView, StyleSheet } from 'react-native';

import { CardPrincipal } from '@/components/pricipalComponents/cardPrincipal';
import { DashboardOfflineBanner } from '@/components/pricipalComponents/offlineBanner';
import { NovaAvaliacaoButton } from '@/components/pricipalComponents/novaAvaliacaoButton';
import { RecentesPrincipal } from '@/components/pricipalComponents/recentsPrincipal';
import { ThemedView } from '@/components/themed-view';
import { useDashboard } from '@/hooks/useDashboard';

function formatStatValue(value: number, isLoading: boolean): string {
  if (isLoading) return '—';
  return String(value);
}

export default function PrincipalScreen() {
  const { data, status, errorMessage } = useDashboard();
  const isLoading = status === 'loading';

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <DashboardOfflineBanner status={status} message={errorMessage} />
        <NovaAvaliacaoButton onPress={() => console.log('Nova Avaliação')} />

        <ThemedView style={styles.statsRow}>
          <CardPrincipal
            label="AVALIAÇÕES HOJE"
            value={formatStatValue(data.assessmentsToday, isLoading)}
            icon="calendar"
          />
          <CardPrincipal
            label="SUSPEITAS"
            value={formatStatValue(data.suspectedCount, isLoading)}
            icon="exclamationmark.triangle.fill"
            valueColor="#E53E3E"
          />
          <CardPrincipal
            label="TOTAL DE PACIENTES"
            value={formatStatValue(data.totalPatients, isLoading)}
            icon="person.2.fill"
          />
        </ThemedView>

        <RecentesPrincipal
          data={isLoading ? [] : data.recentAssessments}
          onVerTodos={() => console.log('Ver todos')}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  statsRow: {
    gap: 12,
  },
});
