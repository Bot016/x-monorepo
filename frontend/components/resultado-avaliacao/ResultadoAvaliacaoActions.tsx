import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FormButton } from '@/components/ui/form-button';
import { useBreakpointLayout } from '@/hooks/useBreakpointLayout';
import { useThemeColor } from '@/hooks/use-theme-color';

const BUTTON_HEIGHT = 52;

type ResultadoAvaliacaoActionsProps = {
  onGoHome?: () => void;
  onNewEvaluation?: () => void;
};

export function ResultadoAvaliacaoActions({
  onGoHome,
  onNewEvaluation,
}: ResultadoAvaliacaoActionsProps) {
  const { isStatsRow } = useBreakpointLayout();
  const buttonColor = useThemeColor({}, 'buttonColor');
  const onPrimaryColor = useThemeColor({}, 'onPrimary');
  const labelColor = useThemeColor({}, 'label');
  const backgroundColor = useThemeColor({}, 'background');
  const greenColor = useThemeColor({}, 'success');

  const handleDownload = () => {
    Alert.alert(
      'Relatório em PDF',
      'A exportação de relatórios estará disponível em uma versão futura.',
    );
  };

  if (isStatsRow) {
    return (
      <View style={styles.wideContainer}>
        <TouchableOpacity
          style={[styles.wideButton, { backgroundColor: buttonColor }]}
          activeOpacity={0.85}
          onPress={handleDownload}
        >
          <IconSymbol name="arrow.down.circle.fill" size={20} color={onPrimaryColor} />
          <ThemedText style={[styles.widePrimaryLabel, { color: onPrimaryColor }]}>
            Baixar Relatório (PDF)
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.wideButton,
            styles.wideOutlineButton,
            { backgroundColor, borderColor: labelColor },
          ]}
          activeOpacity={0.85}
          onPress={onGoHome}
        >
          <IconSymbol name="house.fill" size={18} color={labelColor} />
          <ThemedText style={[styles.wideOutlineLabel, { color: labelColor }]}>
            Voltar ao Início
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.wideButton,
            styles.wideOutlineButton,
            { backgroundColor, borderColor: greenColor },
          ]}
          activeOpacity={0.85}
          onPress={onNewEvaluation}
        >
          <IconSymbol name="plus.circle.fill" size={18} color={greenColor} />
          <ThemedText style={[styles.wideOutlineLabel, { color: greenColor }]}>
            Nova Avaliação
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FormButton
        label="Baixar Relatório (PDF)"
        icon="arrow.down.circle.fill"
        grouped
        onPress={handleDownload}
      />

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
  wideContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    marginTop: 24,
  },
  wideButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: BUTTON_HEIGHT,
    gap: 8,
    paddingHorizontal: 12,
  },
  wideOutlineButton: {
    borderWidth: 2,
  },
  widePrimaryLabel: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  wideOutlineLabel: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
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
