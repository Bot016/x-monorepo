import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import { PacientesFilters } from '@/components/pacientesComponents';
import { Screen } from '@/components/Screen';
import { ScreenPageHeader } from '@/components/ScreenPageHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LAYOUT } from '@/constants/layout';
import { useAsyncList } from '@/hooks/useAsyncList';
import { useBreakpointLayout } from '@/hooks/useBreakpointLayout';
import { useThemeColor } from '@/hooks/use-theme-color';
import {
  DEFAULT_PATIENT_FILTERS,
  filterPatients,
  hasActivePatientFilters,
  listPatients,
} from '@/services/patients';
import { ageFromBirthDate } from '@/utils/patient';
import { navigateToEvaluationResult } from '@/utils/evaluationResult';

export default function PacientesScreen() {
  const router = useRouter();
  const cardBorderColor = useThemeColor({}, 'cardBorder');
  const errorColor = useThemeColor({}, 'error');
  const { gridColumns, isStatsRow } = useBreakpointLayout();
  const listColumns = Platform.OS === 'web' ? 1 : gridColumns;
  const isWebList = Platform.OS === 'web';
  const pagePadding = isStatsRow ? 24 : 16;
  const rowPadding = 16;
  const { items: patients, isLoading, isRefreshing, errorMessage, reload } = useAsyncList(
    listPatients,
    { errorMessage: 'Não foi possível carregar os pacientes.' },
  );
  const [filters, setFilters] = useState(DEFAULT_PATIENT_FILTERS);
  const filteredPatients = useMemo(
    () => filterPatients(patients, filters),
    [patients, filters],
  );
  const hasFilters = hasActivePatientFilters(filters);
  const emptyMessage =
    patients.length === 0
      ? 'Nenhum paciente cadastrado ainda.'
      : hasFilters
        ? 'Nenhum paciente encontrado para a busca.'
        : 'Nenhum paciente cadastrado ainda.';

  if (isLoading) {
    return (
      <Screen withTabBar topAppBar style={styles.centered}>
        <ActivityIndicator size="large" />
      </Screen>
    );
  }

  return (
    <Screen withTabBar topAppBar style={styles.screen}>
      <View style={[styles.topSection, { paddingHorizontal: pagePadding }]}>
        <View style={styles.contentColumn}>
          <ScreenPageHeader
            title="Pacientes"
            subtitle="Pacientes cadastrados e avaliados por você."
          />
          {errorMessage ? (
            <ThemedText style={[styles.error, { color: errorColor }]}>{errorMessage}</ThemedText>
          ) : null}
          <PacientesFilters
            search={filters.search}
            onChange={(search) => setFilters({ search })}
          />
        </View>
      </View>

      <View style={[styles.listArea, { paddingHorizontal: pagePadding }]}>
        <FlatList
          data={filteredPatients}
          key={listColumns}
          numColumns={listColumns}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => void reload(true)} />
          }
          style={isWebList ? styles.webFlatList : undefined}
          contentContainerStyle={[
            styles.list,
            isWebList && styles.webListContent,
            isWebList && { borderColor: cardBorderColor },
            filteredPatients.length === 0 && styles.listEmpty,
          ]}
          columnWrapperStyle={listColumns > 1 ? styles.columnWrapper : undefined}
          ListEmptyComponent={
            <ThemedText style={[styles.empty, { paddingHorizontal: pagePadding }]}>
              {emptyMessage}
            </ThemedText>
          }
          renderItem={({ item, index }) => (
            <View style={[listColumns > 1 ? styles.gridItem : styles.listItem, isWebList && styles.webListItem]}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.cardTouchable}
                onPress={() => navigateToEvaluationResult(router, { patientId: item.id })}
              >
                <ThemedView
                  style={[
                    isWebList ? styles.webRow : styles.card,
                    isWebList && { borderBottomColor: cardBorderColor },
                    isWebList && { paddingHorizontal: rowPadding },
                    isWebList && index === filteredPatients.length - 1 && styles.webRowLast,
                    !isWebList && { borderColor: cardBorderColor },
                  ]}
                >
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
      </View>
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
  topSection: {
    paddingTop: 24,
    marginBottom: 12,
  },
  contentColumn: {
    width: '100%',
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: 'center',
    gap: 12,
  },
  listArea: {
    flex: 1,
  },
  list: {
    paddingBottom: 24,
  },
  webListContent: {
    width: '100%',
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  webFlatList: {
    width: '100%',
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
  webListItem: {
    marginBottom: 0,
    maxWidth: '100%',
  },
  webRow: {
    paddingVertical: 14,
    gap: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: 0,
  },
  webRowLast: {
    borderBottomWidth: 0,
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

