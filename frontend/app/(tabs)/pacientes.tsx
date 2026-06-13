import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { Screen } from '@/components/Screen';
import { ScreenContent } from '@/components/ScreenContent';
import { ScreenPageHeader } from '@/components/ScreenPageHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LAYOUT } from '@/constants/layout';
import { useAsyncList } from '@/hooks/useAsyncList';
import { useBreakpointLayout } from '@/hooks/useBreakpointLayout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { listPatients } from '@/services/patients';
import { ageFromBirthDate } from '@/utils/patient';
import { navigateToEvaluationResult } from '@/utils/evaluationResult';

export default function PacientesScreen() {
  const router = useRouter();
  const cardBorderColor = useThemeColor({}, 'cardBorder');
  const errorColor = useThemeColor({}, 'error');
  const { gridColumns } = useBreakpointLayout();
  const { items: patients, isLoading, isRefreshing, errorMessage, reload } = useAsyncList(
    listPatients,
    { errorMessage: 'Não foi possível carregar os pacientes.' },
  );

  if (isLoading) {
    return (
      <Screen withTabBar topAppBar style={styles.centered}>
        <ActivityIndicator size="large" />
      </Screen>
    );
  }

  return (
    <Screen withTabBar topAppBar style={styles.screen}>
      <ScreenContent style={styles.pageHeader}>
        <ScreenPageHeader
          title="Pacientes"
          subtitle="Pacientes cadastrados e avaliados por você."
        />
        {errorMessage ? (
          <ThemedText style={[styles.error, { color: errorColor }]}>{errorMessage}</ThemedText>
        ) : null}
      </ScreenContent>

      <FlatList
        data={patients}
        key={gridColumns}
        numColumns={gridColumns}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => void reload(true)} />
        }
        contentContainerStyle={[
          styles.list,
          patients.length === 0 && styles.listEmpty,
        ]}
        columnWrapperStyle={gridColumns > 1 ? styles.columnWrapper : undefined}
        ListEmptyComponent={
          <ThemedText style={styles.empty}>Nenhum paciente cadastrado ainda.</ThemedText>
        }
        renderItem={({ item }) => (
          <View style={gridColumns > 1 ? styles.gridItem : styles.listItem}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.cardTouchable}
              onPress={() => navigateToEvaluationResult(router, { patientId: item.id })}
            >
              <ThemedView style={[styles.card, { borderColor: cardBorderColor }]}>
                <ThemedText style={styles.patientName}>{item.name}</ThemedText>
                <ThemedText style={styles.patientMeta}>
                  {item.sex === 'm' ? 'Masculino' : 'Feminino'} ·{' '}
                  {ageFromBirthDate(item.birthDate)} anos
                </ThemedText>
                {item.guardian?.name ? (
                  <ThemedText style={styles.guardian}>
                    Responsável: {item.guardian.name}
                  </ThemedText>
                ) : null}
              </ThemedView>
            </TouchableOpacity>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 8,
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  listEmpty: {
    flexGrow: 1,
    alignItems: 'flex-start',
  },
  columnWrapper: {
    gap: 10,
    width: '100%',
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: 'center',
  },
  gridItem: {
    flex: 1,
    marginBottom: 10,
  },
  listItem: {
    width: '100%',
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: 'center',
    marginBottom: 10,
  },
  cardTouchable: {
    flex: 1,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 4,
    flex: 1,
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
    width: '100%',
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: 'center',
  },
  error: {
    fontSize: 14,
  },
});
