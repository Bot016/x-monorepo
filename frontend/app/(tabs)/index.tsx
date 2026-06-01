import { ScrollView, StyleSheet } from 'react-native';

import { CardPrincipal } from '@/components/pricipalComponents/cardPrincipal';
import { DashboardOfflineBanner } from '@/components/pricipalComponents/offlineBanner';
import { NovaAvaliacaoButton } from '@/components/pricipalComponents/novaAvaliacaoButton';
import { RecentesPrincipal } from '@/components/pricipalComponents/recentsPrincipal';
import { ThemedView } from '@/components/themed-view';

export default function PrincipalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <DashboardOfflineBanner />
        <NovaAvaliacaoButton onPress={() => console.log('Nova Avaliação')} />

        <ThemedView style={styles.statsRow}>
          <CardPrincipal label="AVALIAÇÕES HOJE" value="12" icon="calendar" />
          <CardPrincipal
            label="SUSPEITAS"
            value="03"
            icon="exclamationmark.triangle.fill"
            valueColor="#E53E3E"
          />
          <CardPrincipal label="TOTAL DE PACIENTES" value="148" icon="person.2.fill" />
        </ThemedView>

        <RecentesPrincipal data={[]} onVerTodos={() => console.log('Ver todos')} />
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
