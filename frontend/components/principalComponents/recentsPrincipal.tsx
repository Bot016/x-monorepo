import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useBreakpointLayout } from '@/hooks/useBreakpointLayout';
import { useThemeColor } from '@/hooks/use-theme-color';

type Evaluation = {
  id: string;
  name: string;
  date: string;
  status: 'SUSPEITA' | 'NÃO SUSPEITO';
};

type RecentesPrincipalProps = {
  data: Evaluation[];
  onVerTodos?: () => void;
  onItemPress?: (evaluationId: string) => void;
};

const LEFT_BAR_COLORS = {
  SUSPEITA: '#E53E3E',
  'NÃO SUSPEITO': '#38A169',
};

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }

  return rows;
}

export function RecentesPrincipal({ data, onVerTodos, onItemPress }: RecentesPrincipalProps) {
  const { isStatsRow } = useBreakpointLayout();
  const columns = isStatsRow ? 3 : 1;
  const rows = chunk(data, columns);

  const cardBackground = useThemeColor({}, 'background');
  const cardBorderColor = useThemeColor({}, 'cardBorder');
  const badgeSuspectBackground = useThemeColor({}, 'badgeSuspectBackground');
  const badgeSuspectText = useThemeColor({}, 'badgeSuspectText');
  const badgeNormalBackground = useThemeColor({}, 'badgeNormalBackground');
  const badgeNormalText = useThemeColor({}, 'badgeNormalText');

  const getBadgeColors = (status: Evaluation['status']) =>
    status === 'SUSPEITA'
      ? { bg: badgeSuspectBackground, text: badgeSuspectText }
      : { bg: badgeNormalBackground, text: badgeNormalText };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Avaliações Recentes</ThemedText>
        <TouchableOpacity onPress={onVerTodos}>
          <ThemedText style={styles.seeAll}>Ver todos</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {rows.map((row, rowIndex) => (
          <View
            key={`recent-row-${rowIndex}`}
            style={[styles.row, isStatsRow && styles.rowHorizontal]}
          >
            {row.map((item) => {
              const badgeColors = getBadgeColors(item.status);

              return (
                <View key={item.id} style={isStatsRow ? styles.gridCard : styles.fullCard}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.cardTouchable}
                    onPress={() => onItemPress?.(item.id)}
                  >
                    <View
                      style={[
                        styles.card,
                        {
                          borderColor: cardBorderColor,
                          backgroundColor: cardBackground,
                        },
                      ]}
                    >
                      <View
                        style={[styles.leftBar, { backgroundColor: LEFT_BAR_COLORS[item.status] }]}
                      />
                      <View style={styles.cardContent}>
                        <ThemedText style={styles.patientName}>{item.name}</ThemedText>
                        <ThemedText style={styles.date}>{item.date}</ThemedText>
                      </View>
                      <View style={[styles.badge, { backgroundColor: badgeColors.bg }]}>
                        <ThemedText style={[styles.badgeText, { color: badgeColors.text }]}>
                          {item.status}
                        </ThemedText>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}

            {isStatsRow && row.length < columns
              ? Array.from({ length: columns - row.length }).map((_, spacerIndex) => (
                  <View key={`recent-spacer-${rowIndex}-${spacerIndex}`} style={styles.gridCard} />
                ))
              : null}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 10,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 13,
    color: '#00478D',
    fontWeight: '500',
  },
  list: {
    gap: 12,
  },
  row: {
    gap: 12,
  },
  rowHorizontal: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  gridCard: {
    flex: 1,
  },
  fullCard: {
    width: '100%',
  },
  cardTouchable: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  leftBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  cardContent: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 4,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    opacity: 0.5,
  },
  badge: {
    marginRight: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
