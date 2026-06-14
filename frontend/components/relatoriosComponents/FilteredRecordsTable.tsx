import { StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LAYOUT } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { mapScreeningLabel, type FilteredRecord } from '@/services/reports';

type FilteredRecordsTableProps = {
  records: FilteredRecord[];
  totalCount: number;
  canLoadMore: boolean;
  onLoadMore?: () => void;
  onRecordPress?: (evaluationId: string) => void;
};

export function FilteredRecordsTable({
  records,
  totalCount,
  canLoadMore,
  onLoadMore,
  onRecordPress,
}: FilteredRecordsTableProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < LAYOUT.statsRowMinWidth;
  const cardBorderColor = useThemeColor({}, 'cardBorder');
  const titleColor = useThemeColor({}, 'title');
  const labelColor = useThemeColor({}, 'label');
  const badgeSuspectBackground = useThemeColor({}, 'badgeSuspectBackground');
  const badgeSuspectText = useThemeColor({}, 'badgeSuspectText');
  const badgeNormalBackground = useThemeColor({}, 'badgeNormalBackground');
  const badgeNormalText = useThemeColor({}, 'badgeNormalText');
  const badgeBackground = useThemeColor({}, 'softSurface');
  const activeColor = useThemeColor({}, 'active');
  const statusSuspectBar = useThemeColor({}, 'statusSuspectBar');
  const statusNormalBar = useThemeColor({}, 'statusNormalBar');

  const leftBarColors = {
    suspected: statusSuspectBar,
    low_risk: statusNormalBar,
  };

  const getBadgeColors = (screeningResult: FilteredRecord['screeningResult']) =>
    screeningResult === 'suspected'
      ? { bg: badgeSuspectBackground, text: badgeSuspectText }
      : { bg: badgeNormalBackground, text: badgeNormalText };

  return (
    <ThemedView style={[styles.card, { borderColor: cardBorderColor }]}>
      <ThemedView
        style={[
          styles.header,
          isCompact && styles.headerCompact,
          { borderBottomColor: cardBorderColor },
        ]}
      >
        <ThemedText style={[styles.title, { color: titleColor }]}>Registros Filtrados</ThemedText>
        <ThemedView style={[styles.countBadge, { backgroundColor: badgeBackground }]}>
          <ThemedText style={[styles.countText, { color: activeColor }]}>
            {totalCount} RESULTADOS
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView
        style={[
          styles.tableHeader,
          isCompact && styles.tableHeaderCompact,
          { borderBottomColor: cardBorderColor },
        ]}
      >
        <ThemedText
          style={[
            styles.columnLabel,
            styles.patientColumn,
            { color: labelColor },
          ]}
        >
          PACIENTE / ID
        </ThemedText>
        {!isCompact ? (
          <ThemedText style={[styles.columnLabel, styles.dateColumn, { color: labelColor }]}>
            DATA TRIAGEM
          </ThemedText>
        ) : null}
        <ThemedText
          style={[
            styles.columnLabel,
            styles.statusColumn,
            styles.statusColumnLabel,
            { color: labelColor },
          ]}
        >
          STATUS
        </ThemedText>
      </ThemedView>

      {records.length === 0 ? (
        <ThemedText style={[styles.empty, { color: labelColor }]}>
          Nenhum relatório encontrado para os filtros selecionados.
        </ThemedText>
      ) : (
        records.map((record) => {
          const badge = getBadgeColors(record.screeningResult);
          return (
            <TouchableOpacity
              key={record.id}
              activeOpacity={0.8}
              onPress={() => onRecordPress?.(record.id)}
            >
              <ThemedView
                style={[
                  styles.row,
                  isCompact && styles.rowCompact,
                  { borderBottomColor: cardBorderColor },
                ]}
              >
                <ThemedView
                  style={[
                    styles.leftBar,
                    { backgroundColor: leftBarColors[record.screeningResult] },
                  ]}
                />
                <ThemedView style={[styles.patientColumn, styles.patientCell]}>
                  <ThemedText style={styles.patientName} numberOfLines={1}>
                    {record.patientName}
                  </ThemedText>
                  <ThemedText style={[styles.patientId, { color: labelColor }]}>
                    ID: {record.patientCode}
                  </ThemedText>
                  {isCompact ? (
                    <ThemedText
                      style={[styles.dateInline, { color: labelColor }]}
                      numberOfLines={1}
                    >
                      {record.assessmentDate}
                    </ThemedText>
                  ) : null}
                </ThemedView>
                {!isCompact ? (
                  <ThemedText
                    style={[styles.dateColumn, styles.dateText, { color: labelColor }]}
                    numberOfLines={1}
                  >
                    {record.assessmentDate}
                  </ThemedText>
                ) : null}
                <ThemedView style={styles.statusColumn}>
                  <ThemedView style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <ThemedText
                      style={[
                        styles.statusText,
                        isCompact && styles.statusTextCompact,
                        { color: badge.text },
                      ]}
                    >
                      {mapScreeningLabel(record.screeningResult)}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </TouchableOpacity>
          );
        })
      )}

      {canLoadMore ? (
        <TouchableOpacity
          style={[styles.loadMore, isCompact && styles.loadMoreCompact]}
          onPress={onLoadMore}
          activeOpacity={0.8}
        >
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
    alignSelf: 'stretch',
    flexGrow: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
  },
  headerCompact: {
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  tableHeaderCompact: {
    paddingHorizontal: 16,
    gap: 12,
  },
  columnLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  patientColumn: {
    flex: 1,
    minWidth: 0,
  },
  dateColumn: {
    width: 88,
    flexShrink: 0,
  },
  statusColumn: {
    width: 84,
    flexShrink: 0,
    alignItems: 'center',
  },
  statusColumnLabel: {
    textAlign: 'center',
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
  rowCompact: {
    paddingRight: 16,
    paddingVertical: 12,
    gap: 12,
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
  dateInline: {
    fontSize: 12,
    marginTop: 2,
  },
  dateText: {
    fontSize: 13,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  statusTextCompact: {
    fontSize: 9,
    letterSpacing: 0.2,
    lineHeight: 12,
  },
  loadMore: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadMoreCompact: {
    paddingVertical: 12,
  },
  loadMoreText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
