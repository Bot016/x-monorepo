import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

type RelatoriosHeaderProps = {
  onExport: () => void;
  isExporting?: boolean;
};

export function RelatoriosHeader({ onExport, isExporting = false }: RelatoriosHeaderProps) {
  const buttonColor = useThemeColor({}, 'buttonColor');
  const onPrimaryColor = useThemeColor({}, 'onPrimary');
  const titleColor = useThemeColor({ light: '#0B1C30', dark: '#ECEDEE' }, 'text');
  const subtitleColor = useThemeColor({}, 'label');

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={[styles.title, { color: titleColor }]}>
        Relatórios e Estatísticas
      </ThemedText>
      <ThemedText style={[styles.subtitle, { color: subtitleColor }]}>
        Análise epidemiológica e métricas de triagem.
      </ThemedText>

      <TouchableOpacity
        style={[
          styles.exportButton,
          { backgroundColor: buttonColor },
          isExporting && styles.exportButtonDisabled,
        ]}
        activeOpacity={0.85}
        onPress={onExport}
        disabled={isExporting}
      >
        {isExporting ? (
          <ActivityIndicator color={onPrimaryColor} size="small" />
        ) : (
          <IconSymbol name="arrow.down.circle.fill" size={16} color={onPrimaryColor} />
        )}
        <ThemedText style={[styles.exportLabel, { color: onPrimaryColor }]}>
          {isExporting ? 'Exportando...' : 'Exportar Dados'}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: 56,
    gap: 8,
    marginTop: 8,
  },
  exportButtonDisabled: {
    opacity: 0.8,
  },
  exportLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
