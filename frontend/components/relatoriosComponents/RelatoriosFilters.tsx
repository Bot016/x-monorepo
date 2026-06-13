import { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { SelectSheet } from '@/components/SelectSheet';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import type {
  ReportAgeFilter,
  ReportFilters,
  ReportPeriod,
  ReportResultFilter,
  ReportSexFilter,
} from '@/services/reports';

type RelatoriosFiltersProps = {
  filters: ReportFilters;
  onChange: (patch: Partial<ReportFilters>) => void;
};

type OpenSelect = 'sexo' | 'faixaEtaria' | 'resultado' | null;

const PERIOD_OPTIONS: { value: ReportPeriod; label: string }[] = [
  { value: 'ultima_semana', label: 'SEMANA' },
  { value: 'ultimo_mes', label: 'MÊS' },
  { value: 'ultimo_ano', label: 'ANO' },
];

const SEX_OPTIONS: { value: ReportSexFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'm', label: 'Masculino' },
  { value: 'f', label: 'Feminino' },
];

const AGE_OPTIONS: { value: ReportAgeFilter; label: string }[] = [
  { value: 'all', label: 'Qualquer idade' },
  { value: '0-5', label: '0 a 5 anos' },
  { value: '6-12', label: '6 a 12 anos' },
  { value: '13-18', label: '13 a 18 anos' },
  { value: '18+', label: '18 anos ou mais' },
];

const RESULT_OPTIONS: { value: ReportResultFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'SUSPEITO', label: 'Suspeito' },
  { value: 'BAIXO_RISCO', label: 'Não suspeito' },
];

export function RelatoriosFilters({ filters, onChange }: RelatoriosFiltersProps) {
  const [openSelect, setOpenSelect] = useState<OpenSelect>(null);
  const cardBorderColor = useThemeColor({}, 'cardBorder');
  const labelColor = useThemeColor({}, 'label');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const activeColor = useThemeColor({ light: '#1D4ED8', dark: '#60A5FA' }, 'tint');
  const segmentBackground = useThemeColor({ light: '#F1F5F9', dark: '#1F2426' }, 'background');

  const sexLabel = SEX_OPTIONS.find((option) => option.value === filters.sexo)?.label ?? 'Todos';
  const ageLabel =
    AGE_OPTIONS.find((option) => option.value === filters.faixaEtaria)?.label ?? 'Qualquer idade';
  const resultLabel =
    RESULT_OPTIONS.find((option) => option.value === filters.resultado)?.label ?? 'Todos';

  return (
    <>
      <ThemedView style={[styles.card, { borderColor: cardBorderColor }]}>
        <ThemedView style={styles.field}>
          <ThemedText style={[styles.fieldLabel, { color: labelColor }]}>PERÍODO</ThemedText>
          <ThemedView style={[styles.segmented, { backgroundColor: segmentBackground }]}>
            {PERIOD_OPTIONS.map((option) => {
              const isActive = filters.periodo === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.segment, isActive && { backgroundColor: inputBackground }]}
                  onPress={() => onChange({ periodo: option.value })}
                  activeOpacity={0.8}
                >
                  <ThemedText
                    style={[
                      styles.segmentText,
                      { color: isActive ? activeColor : labelColor },
                      isActive && styles.segmentTextActive,
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </ThemedView>
        </ThemedView>

        <FilterSelect
          label="SEXO"
          value={sexLabel}
          labelColor={labelColor}
          inputBackground={inputBackground}
          cardBorderColor={cardBorderColor}
          onPress={() => setOpenSelect('sexo')}
        />

        <FilterSelect
          label="FAIXA ETÁRIA"
          value={ageLabel}
          labelColor={labelColor}
          inputBackground={inputBackground}
          cardBorderColor={cardBorderColor}
          onPress={() => setOpenSelect('faixaEtaria')}
        />

        <FilterSelect
          label="STATUS DE SUSPEITA"
          value={resultLabel}
          labelColor={labelColor}
          inputBackground={inputBackground}
          cardBorderColor={cardBorderColor}
          onPress={() => setOpenSelect('resultado')}
        />
      </ThemedView>

      <SelectSheet
        visible={openSelect === 'sexo'}
        title="Sexo"
        options={SEX_OPTIONS}
        selectedValue={filters.sexo}
        onSelect={(sexo) => onChange({ sexo })}
        onClose={() => setOpenSelect(null)}
      />

      <SelectSheet
        visible={openSelect === 'faixaEtaria'}
        title="Faixa etária"
        options={AGE_OPTIONS}
        selectedValue={filters.faixaEtaria}
        onSelect={(faixaEtaria) => onChange({ faixaEtaria })}
        onClose={() => setOpenSelect(null)}
      />

      <SelectSheet
        visible={openSelect === 'resultado'}
        title="Status de suspeita"
        options={RESULT_OPTIONS}
        selectedValue={filters.resultado}
        onSelect={(resultado) => onChange({ resultado })}
        onClose={() => setOpenSelect(null)}
      />
    </>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  labelColor: string;
  inputBackground: string;
  cardBorderColor: string;
  onPress: () => void;
};

function FilterSelect({
  label,
  value,
  labelColor,
  inputBackground,
  cardBorderColor,
  onPress,
}: FilterSelectProps) {
  return (
    <ThemedView style={styles.field}>
      <ThemedText style={[styles.fieldLabel, { color: labelColor }]}>{label}</ThemedText>
      <TouchableOpacity
        style={[
          styles.select,
          { backgroundColor: inputBackground, borderColor: cardBorderColor },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.selectValue}>{value}</ThemedText>
        <IconSymbol name="chevron.down" size={18} color={labelColor} />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 24,
    gap: 24,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
    gap: 0,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    paddingVertical: 6,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '500',
  },
  segmentTextActive: {
    fontWeight: '700',
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  selectValue: {
    fontSize: 14,
  },
});
