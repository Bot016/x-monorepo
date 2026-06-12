import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { CardPrincipal } from '@/components/principalComponents/cardPrincipal';
import { DashboardOfflineBanner } from '@/components/principalComponents/offlineBanner';
import { NovaAvaliacaoButton } from '@/components/principalComponents/novaAvaliacaoButton';
import { RecentesPrincipal } from '@/components/principalComponents/recentsPrincipal';
import { ThemedView } from '@/components/themed-view';
import { useDashboard } from '@/hooks/useDashboard';
import { useThemeColor } from '@/hooks/use-theme-color';

function formatStatValue(value: number, isLoading: boolean): string {
  if (isLoading) return '—';
  return String(value);
}

export default function PrincipalScreen() {
  const router = useRouter();
  const suspectValueColor = useThemeColor({}, 'suspectValue');
  const { data, status, errorMessage } = useDashboard();
  const isLoading = status === 'loading';

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <DashboardOfflineBanner status={status} message={errorMessage} />
        <NovaAvaliacaoButton onPress={() => router.push('/cadastro-paciente')} />

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
            valueColor={suspectValueColor}
          />
          <CardPrincipal
            label="TOTAL DE PACIENTES"
            value={formatStatValue(data.totalPatients, isLoading)}
            icon="person.2.fill"
          />
        </ThemedView>

        <RecentesPrincipal
          data={isLoading ? [] : data.recentAssessments}
          onVerTodos={() => router.push('/(tabs)/relatorios')}
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
