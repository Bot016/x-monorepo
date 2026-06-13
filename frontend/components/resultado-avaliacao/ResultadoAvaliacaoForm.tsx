import { ScrollView, StyleSheet, View } from 'react-native';

import { ScreenContent } from '@/components/ScreenContent';
import { formStyles } from '@/components/authComponents/formStyles';
import { ResultadoAvaliacaoActions } from '@/components/resultado-avaliacao/ResultadoAvaliacaoActions';
import { ResultadoAvaliacaoAlertCard } from '@/components/resultado-avaliacao/ResultadoAvaliacaoAlertCard';
import { ResultadoAvaliacaoDetails } from '@/components/resultado-avaliacao/ResultadoAvaliacaoDetails';
import { ResultadoAvaliacaoHeader } from '@/components/resultado-avaliacao/ResultadoAvaliacaoHeader';
import { ResultadoAvaliacaoScoreCard } from '@/components/resultado-avaliacao/ResultadoAvaliacaoScoreCard';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { ScreeningResult } from '@/services/types/api';

type ResultadoAvaliacaoFormProps = {
  patientName?: string;
  score?: number;
  maxScore?: number;
  screeningResult?: ScreeningResult;
  alertMessage?: string;
  detailItems?: {
    label: string;
    value: string | number;
  }[];
  onGoHome?: () => void;
  onNewEvaluation?: () => void;
};

export function ResultadoAvaliacaoForm({
  patientName,
  score = 0,
  maxScore = 1,
  screeningResult = 'low_risk',
  alertMessage = 'O resultado sugere possível manifestação de características relacionadas à Síndrome de X Frágil.',
  detailItems = [],
  onGoHome,
  onNewEvaluation,
}: ResultadoAvaliacaoFormProps) {
  const labelColor = useThemeColor({}, 'label');
  const isSuspected = screeningResult === 'suspected';

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <ScreenContent style={styles.content}>
      <ResultadoAvaliacaoHeader />

      <View style={formStyles.container}>
        {patientName ? (
          <ThemedText style={[formStyles.label, { color: labelColor }]}>
            PACIENTE: {patientName.toUpperCase()}
          </ThemedText>
        ) : null}

        <ResultadoAvaliacaoScoreCard score={score} maxScore={maxScore} />

        <ResultadoAvaliacaoAlertCard
          title={isSuspected ? 'SUSPEITA DE X FRÁGIL' : 'BAIXO RISCO'}
          description={alertMessage}
          type={isSuspected ? 'warning' : 'info'}
        />

        <ThemedText style={[formStyles.label, { color: labelColor }]}>
          RECOMENDAÇÃO CLÍNICA
        </ThemedText>

        <ResultadoAvaliacaoAlertCard
          title={isSuspected ? 'ENCAMINHAMENTO INDICADO' : 'ACOMPANHAMENTO DE ROTINA'}
          description={
            isSuspected
              ? 'Exame molecular para confirmação diagnóstica. Recomenda-se referência para serviço de genética clínica para avaliação especializada.'
              : 'Continue o acompanhamento clínico de rotina. Reavalie se novos sintomas surgirem.'
          }
          type="info"
        />

        <ResultadoAvaliacaoDetails items={detailItems} />

        <ResultadoAvaliacaoActions
          onGoHome={onGoHome}
          onNewEvaluation={onNewEvaluation}
        />
      </View>
      </ScreenContent>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    paddingHorizontal: 24,
  },
  content: {
    gap: 12,
  },
});
