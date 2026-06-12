import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { mapScreeningLabel, type FilteredRecord } from '@/services/reports';

type FilteredRecordsTableProps = {
  records: FilteredRecord[];
  totalCount: number;
  canLoadMore: boolean;
  onLoadMore?: () => void;
};

const LEFT_BAR_COLORS = {
  SUSPEITO: '#E53E3E',
  BAIXO_RISCO: '#38A169',
};

const BADGE_COLORS = {
  SUSPEITO: { bg: '#FEE2E2', text: '#C53030' },
  BAIXO_RISCO: { bg: '#D1FAE5', text: '#065F46' },
};

export function FilteredRecordsTable({
  records,
  totalCount,
  canLoadMore,
  onLoadMore,
}: FilteredRecordsTableProps) {
  const cardBorderColor = useThemeColor({}, 'cardBorder');
  const titleColor = useThemeColor({ light: '#0B1C30', dark: '#ECEDEE' }, 'text');
  const labelColor = useThemeColor({}, 'label');
  const badgeBackground = useThemeColor({ light: '#EFF6FF', dark: '#1F2426' }, 'iconBoxColor');
  const activeColor = useThemeColor({ light: '#1D4ED8', dark: '#60A5FA' }, 'tint');

  return (
    <ThemedView style={[styles.card, { borderColor: cardBorderColor }]}>
      <ThemedView style={[styles.header, { borderBottomColor: cardBorderColor }]}>
        <ThemedText style={[styles.title, { color: titleColor }]}>Registros Filtrados</ThemedText>
        <ThemedView style={[styles.countBadge, { backgroundColor: badgeBackground }]}>
          <ThemedText style={[styles.countText, { color: activeColor }]}>
            {totalCount} RESULTADOS
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={[styles.tableHeader, { borderBottomColor: cardBorderColor }]}>
        <ThemedText style={[styles.columnLabel, styles.patientColumn, { color: labelColor }]}>
          PACIENTE / ID
        </ThemedText>
        <ThemedText style={[styles.columnLabel, styles.dateColumn, { color: labelColor }]}>
          DATA TRIAGEM
        </ThemedText>
        <ThemedText style={[styles.columnLabel, styles.statusColumn, { color: labelColor }]}>
          STATUS
        </ThemedText>
      </ThemedView>

      {records.length === 0 ? (
        <ThemedText style={[styles.empty, { color: labelColor }]}>
          Nenhum relatório encontrado para os filtros selecionados.
        </ThemedText>
      ) : (
        records.map((record) => {
          const badge = BADGE_COLORS[record.screeningResult];
          return (
            <ThemedView
              key={record.id}
              style={[styles.row, { borderBottomColor: cardBorderColor }]}
            >
              <ThemedView
                style={[
                  styles.leftBar,
                  { backgroundColor: LEFT_BAR_COLORS[record.screeningResult] },
                ]}
              />
              <ThemedView style={[styles.patientColumn, styles.patientCell]}>
                <ThemedText style={styles.patientName} numberOfLines={2}>
                  {record.patientName}
                </ThemedText>
                <ThemedText style={[styles.patientId, { color: labelColor }]}>
                  ID: {record.patientCode}
                </ThemedText>
              </ThemedView>
              <ThemedText style={[styles.dateColumn, styles.dateText, { color: labelColor }]}>
                {record.assessmentDate}
              </ThemedText>
              <ThemedView style={styles.statusColumn}>
                <ThemedView style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                  <ThemedText style={[styles.statusText, { color: badge.text }]}>
                    {mapScreeningLabel(record.screeningResult)}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          );
        })
      )}

      {canLoadMore ? (
        <TouchableOpacity style={styles.loadMore} onPress={onLoadMore} activeOpacity={0.8}>
          <ThemedText style={[styles.loadMoreText, { color: activeColor }]}>
            CARREGAR MAIS REGISTROS
          </ThemedText>
        </TouchableOpacity>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  countBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  columnLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  patientColumn: {
    flex: 1.2,
  },
  dateColumn: {
    flex: 0.9,
  },
  statusColumn: {
    flex: 0.9,
    alignItems: 'flex-end',
  },
  empty: {
    padding: 24,
    fontSize: 14,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 8,
  },
  leftBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  patientCell: {
    paddingLeft: 12,
    gap: 4,
  },
  patientName: {
    fontSize: 14,
    fontWeight: '700',
  },
  patientId: {
    fontSize: 10,
  },
  dateText: {
    fontSize: 13,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  loadMore: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadMoreText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
