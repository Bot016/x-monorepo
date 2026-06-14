import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { ReportSymptomIncidence } from '@/services/reports';

type SymptomIncidenceChartProps = {
  symptoms: ReportSymptomIncidence[];
};

const TOP_LIMIT = 5;

export function SymptomIncidenceChart({ symptoms }: SymptomIncidenceChartProps) {
  const cardBorderColor = useThemeColor({}, 'cardBorder');
  const titleColor = useThemeColor({}, 'title');
  const labelColor = useThemeColor({}, 'label');
  const badgeColor = useThemeColor({}, 'active');
  const barColor = useThemeColor({}, 'buttonColor');
  const trackColor = useThemeColor({}, 'segmentBackground');

  const topSymptoms = [...symptoms]
    .sort((left, right) => right.ocorrencias - left.ocorrencias)
    .slice(0, TOP_LIMIT);

  const maxOccurrences = topSymptoms[0]?.ocorrencias ?? 1;

  return (
    <ThemedView style={[styles.card, { borderColor: cardBorderColor }]}>
      <ThemedView style={styles.header}>
        <ThemedText style={[styles.title, { color: titleColor }]}>
          Incidência de Sintomas
        </ThemedText>
        <ThemedView style={styles.badge}>
          <ThemedText style={[styles.badgeText, { color: badgeColor }]}>Top {TOP_LIMIT}</ThemedText>
        </ThemedView>
      </ThemedView>

      {topSymptoms.length === 0 ? (
        <ThemedText style={[styles.empty, { color: labelColor }]}>
          Nenhum sintoma registrado para os filtros selecionados.
        </ThemedText>
      ) : (
        <ThemedView style={styles.bars}>
          {topSymptoms.map((symptom) => {
            const widthPct = Math.max((symptom.ocorrencias / maxOccurrences) * 100, 8);
            const pctLabel = Math.round((symptom.ocorrencias / maxOccurrences) * 100);

            return (
              <ThemedView key={symptom.sintomaId} style={styles.row}>
                <ThemedView style={styles.rowHeader}>
                  <ThemedText style={[styles.symptomName, { color: labelColor }]} numberOfLines={1}>
                    {symptom.nome}
                  </ThemedText>
                  <ThemedText style={[styles.pct, { color: badgeColor }]}>{pctLabel}%</ThemedText>
                </ThemedView>
                <ThemedView style={[styles.track, { backgroundColor: trackColor }]}>
                  <ThemedView
                    style={[
                      styles.fill,
                      { width: `${widthPct}%`, backgroundColor: barColor },
                    ]}
                  />
                </ThemedView>
              </ThemedView>
            );
          })}
        </ThemedView>
      )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  empty: {
    fontSize: 13,
    lineHeight: 20,
  },
  bars: {
    gap: 10,
  },
  row: {
    gap: 4,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  symptomName: {
    fontSize: 11,
    flex: 1,
  },
  pct: {
    fontSize: 11,
    fontWeight: '600',
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: 8,
    borderRadius: 4,
  },
});
