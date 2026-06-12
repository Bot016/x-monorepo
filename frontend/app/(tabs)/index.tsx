import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { CardPrincipal } from '@/components/principalComponents/cardPrincipal';
import { DashboardOfflineBanner } from '@/components/principalComponents/offlineBanner';
import { NovaAvaliacaoButton } from '@/components/principalComponents/novaAvaliacaoButton';
import { RecentesPrincipal } from '@/components/principalComponents/recentsPrincipal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LAYOUT } from '@/constants/layout';
import { useDashboard } from '@/hooks/useDashboard';
import { useThemeColor } from '@/hooks/use-theme-color';

function formatStatValue(value: number, isLoading: boolean): string {
  if (isLoading) return '—';
  return String(value);
}

export default function PrincipalScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const suspectValueColor = useThemeColor({}, 'suspectValue');
  const { data, status, errorMessage } = useDashboard();
  const isLoading = status === 'loading';

  const isStatsRow = width >= LAYOUT.statsRowMinWidth;
  const isWideDashboard = width >= LAYOUT.dashboardWideMinWidth;

  const statsCards = [
    {
      key: 'assessments-today',
      label: 'AVALIAÇÕES HOJE',
      value: formatStatValue(data.assessmentsToday, isLoading),
      icon: 'calendar',
    },
    {
      key: 'suspected',
      label: 'SUSPEITAS',
      value: formatStatValue(data.suspectedCount, isLoading),
      icon: 'exclamationmark.triangle.fill',
      valueColor: suspectValueColor,
    },
    {
      key: 'patients',
      label: 'TOTAL DE PACIENTES',
      value: formatStatValue(data.totalPatients, isLoading),
      icon: 'person.2.fill',
    },
  ] as const;

  return (
    <Screen withTabBar topAppBar>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {isWideDashboard ? (
            <View style={styles.headerRow}>
              <View style={styles.headerText}>
                <ThemedText type="title">Principal</ThemedText>
                <ThemedText style={styles.subtitle}>
                  Visão geral das avaliações e pacientes cadastrados.
                </ThemedText>
              </View>

              <NovaAvaliacaoButton
                fullWidth={false}
                onPress={() => router.push('/cadastro-paciente')}
              />
            </View>
          ) : (
            <>
              <ThemedText type="title">Principal</ThemedText>
              <ThemedText style={styles.subtitle}>
                Visão geral das avaliações e pacientes cadastrados.
              </ThemedText>
            </>
          )}

          <DashboardOfflineBanner status={status} message={errorMessage} />

          {!isWideDashboard ? (
            <NovaAvaliacaoButton onPress={() => router.push('/cadastro-paciente')} />
          ) : null}

          <ThemedView style={[styles.statsRow, isStatsRow && styles.statsRowHorizontal]}>
            {statsCards.map((card) => (
              <ThemedView
                key={card.key}
                style={isStatsRow ? styles.statCard : undefined}
              >
                <CardPrincipal
                  label={card.label}
                  value={card.value}
                  icon={card.icon}
                  valueColor={'valueColor' in card ? card.valueColor : undefined}
                />
              </ThemedView>
            ))}
          </ThemedView>

          <RecentesPrincipal
            data={isLoading ? [] : data.recentAssessments}
            onVerTodos={() => router.push('/(tabs)/relatorios')}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  content: {
    width: '100%',
    maxWidth: LAYOUT.contentMaxWidth,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 24,
  },
  headerText: {
    flex: 1,
    gap: 4,
    paddingRight: 8,
  },
  subtitle: {
    opacity: 0.7,
  },
  statsRow: {
    gap: 12,
  },
  statsRowHorizontal: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  statCard: {
    flex: 1,
  },
});
