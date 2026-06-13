import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { displayNumberStyle } from '@/utils/displayText';

type SuspectDistributionChartProps = {
  suspect: number;
  lowRisk: number;
};

export function SuspectDistributionChart({ suspect, lowRisk }: SuspectDistributionChartProps) {
  const cardBorderColor = useThemeColor({}, 'cardBorder');
  const cardBackground = useThemeColor({}, 'background');
  const titleColor = useThemeColor({ light: '#0B1C30', dark: '#ECEDEE' }, 'text');
  const legendBackground = useThemeColor({ light: '#EFF6FF', dark: '#1F2426' }, 'iconBoxColor');
  const centerBackground = useThemeColor({}, 'background');
  const totalValueColor = useThemeColor({ light: '#0B1C30', dark: '#ECEDEE' }, 'text');
  const totalLabelColor = useThemeColor({}, 'label');
  const legendValueColor = useThemeColor({ light: '#0B1C30', dark: '#ECEDEE' }, 'text');

  const total = suspect + lowRisk;
  const suspectPct = total > 0 ? (suspect / total) * 100 : 0;
  const lowRiskPct = total > 0 ? (lowRisk / total) * 100 : 0;

  return (
    <ThemedView
      style={[styles.card, { borderColor: cardBorderColor, backgroundColor: cardBackground }]}
    >
      <ThemedText style={[styles.title, { color: titleColor }]}>
        Suspeitas vs. Não Suspeitas
      </ThemedText>

      <View style={styles.chartArea}>
        <View style={styles.donut}>
          <View style={styles.ratioBar}>
            <View style={[styles.suspectSlice, { flex: suspectPct || 0.001 }]} />
            <View style={[styles.lowRiskSlice, { flex: lowRiskPct || 0.001 }]} />
          </View>
          <View style={[styles.center, { backgroundColor: centerBackground }]}>
            <ThemedText style={[styles.totalValue, { color: totalValueColor }]}>{total}</ThemedText>
            <ThemedText style={[styles.totalLabel, { color: totalLabelColor }]}>TOTAL</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.legend}>
        <View style={[styles.legendRow, { backgroundColor: legendBackground }]}>
          <View style={styles.legendLeft}>
            <View style={[styles.dot, styles.suspectDot]} />
            <ThemedText style={styles.legendLabel}>Suspeitas</ThemedText>
          </View>
          <ThemedText style={[styles.legendValue, { color: legendValueColor }]}>
            {suspect} ({suspectPct.toFixed(1)}%)
          </ThemedText>
        </View>

        <View style={[styles.legendRow, { backgroundColor: legendBackground }]}>
          <View style={styles.legendLeft}>
            <View style={[styles.dot, styles.lowRiskDot]} />
            <ThemedText style={styles.legendLabel}>Não Suspeitas</ThemedText>
          </View>
          <ThemedText style={[styles.legendValue, { color: legendValueColor }]}>
            {lowRisk} ({lowRiskPct.toFixed(1)}%)
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  chartArea: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  donut: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratioBar: {
    position: 'absolute',
    top: 0,
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    flexDirection: 'row',
    transform: [{ rotate: '-90deg' }],
  },
  suspectSlice: {
    backgroundColor: '#38A169',
  },
  lowRiskSlice: {
    backgroundColor: '#1D4ED8',
  },
  center: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    overflow: 'visible',
  },
  totalValue: displayNumberStyle(28),
  totalLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  legend: {
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  suspectDot: {
    backgroundColor: '#38A169',
  },
  lowRiskDot: {
    backgroundColor: '#1D4ED8',
  },
  legendLabel: {
    fontSize: 14,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
