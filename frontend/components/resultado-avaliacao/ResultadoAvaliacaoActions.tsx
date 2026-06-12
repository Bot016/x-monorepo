import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

type ResultadoAvaliacaoActionsProps = {
  onGoHome?: () => void;
  onNewEvaluation?: () => void;
};

export function ResultadoAvaliacaoActions({
  onGoHome,
  onNewEvaluation,
}: ResultadoAvaliacaoActionsProps) {
  const buttonColor = useThemeColor({}, 'buttonColor');
  const labelColor = useThemeColor({}, 'label');
  const onPrimaryColor = useThemeColor({}, 'onPrimary');
  const backgroundColor = useThemeColor({}, 'background');
  const greenColor = '#10B981';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: buttonColor }]}
        activeOpacity={0.85}
        onPress={() => {
          Alert.alert(
            'Relatório em PDF',
            'A exportação de relatórios estará disponível em uma versão futura.',
          );
        }}
      >
        <IconSymbol name="arrow.down.circle.fill" size={20} color={onPrimaryColor} />
        <ThemedText style={[styles.primaryLabel, { color: onPrimaryColor }]}>
          Baixar Relatório (PDF)
        </ThemedText>
      </TouchableOpacity>

      <View style={styles.secondaryButtonsRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor, borderColor: labelColor }]}
          activeOpacity={0.85}
          onPress={onGoHome}
        >
          <IconSymbol name="house.fill" size={18} color={labelColor} />
          <ThemedText style={[styles.secondaryLabel, { color: labelColor }]}>
            Voltar ao{'\n'}Início
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor, borderColor: greenColor }]}
          activeOpacity={0.85}
          onPress={onNewEvaluation}
        >
          <IconSymbol name="plus.circle.fill" size={18} color={greenColor} />
          <ThemedText style={[styles.secondaryLabel, { color: greenColor }]}>
            Nova{'\n'}Avaliação
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginTop: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 56,
    gap: 10,
    shadowColor: '#1A56DB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryLabel: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryButtonsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 100,
    borderWidth: 2,
    gap: 8,
  },
  secondaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
});
