import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { HeaderActionButton } from '@/components/HeaderActionButton';
import { Screen } from '@/components/Screen';
import { ScreenContent } from '@/components/ScreenContent';
import { ScreenPageHeader } from '@/components/ScreenPageHeader';
import { CardPrincipal } from '@/components/principalComponents/cardPrincipal';
import { DashboardOfflineBanner } from '@/components/principalComponents/offlineBanner';
import { RecentesPrincipal } from '@/components/principalComponents/recentsPrincipal';
import { useBreakpointLayout } from '@/hooks/useBreakpointLayout';
import { useDashboard } from '@/hooks/useDashboard';
import { useThemeColor } from '@/hooks/use-theme-color';
import { navigateToEvaluationResult } from '@/utils/evaluationResult';

function formatStatValue(value: number, isLoading: boolean): string {
  if (isLoading) return '—';
  return String(value);
}

export default function PrincipalScreen() {
  const router = useRouter();
  const suspectValueColor = useThemeColor({}, 'suspectValue');
  const { isStatsRow, isWide: isWideDashboard } = useBreakpointLayout();
  const { data, status, errorMessage } = useDashboard();
  const isLoading = status === 'loading';

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
        <ScreenContent style={styles.content}>
          <ScreenPageHeader
            title="Principal"
            subtitle="Visão geral das avaliações e pacientes cadastrados."
            wide={isWideDashboard}
            action={
              <HeaderActionButton
                label="Nova Avaliação"
                icon="plus.circle.fill"
                onPress={() => router.push('/cadastro-paciente')}
                fullWidth={!isWideDashboard}
              />
            }
          />

          <DashboardOfflineBanner status={status} message={errorMessage} />

          <View style={[styles.statsRow, isStatsRow && styles.statsRowHorizontal]}>
            {statsCards.map((card) => (
              <View
                key={card.key}
                style={isStatsRow ? styles.statCard : undefined}
              >
                <CardPrincipal
                  label={card.label}
                  value={card.value}
                  icon={card.icon}
                  valueColor={'valueColor' in card ? card.valueColor : undefined}
                />
              </View>
            ))}
          </View>

          <RecentesPrincipal
            data={isLoading ? [] : data.recentAssessments}
            onVerTodos={() => router.push('/(tabs)/relatorios')}
            onItemPress={(evaluationId) =>
              navigateToEvaluationResult(router, { evaluationId })
            }
          />
        </ScreenContent>
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
    gap: 12,
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
