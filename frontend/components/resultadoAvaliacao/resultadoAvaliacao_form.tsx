import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ResultadoAvaliacao_Header } from '@/components/resultadoAvaliacao/resultadoAvaliacao_header';
import { ResultadoAvaliacao_ScoreCard } from '@/components/resultadoAvaliacao/resultadoAvaliacao_score_card';
import { ResultadoAvaliacao_AlertCard } from '@/components/resultadoAvaliacao/resultadoAvaliacao_alert_card';
import { ResultadoAvaliacao_Details } from '@/components/resultadoAvaliacao/resultadoAvaliacao_details';
import { ResultadoAvaliacao_Actions } from '@/components/resultadoAvaliacao/resultadoAvaliacao_actions';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formStyles } from '@/components/authComponents/formStyles';
import type { ScreeningResult } from '@/services/types/api';

type ResultadoAvaliacao_FormProps = {
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

export function ResultadoAvaliacao_Form({
  patientName,
  score = 0,
  maxScore = 1,
  screeningResult = 'BAIXO_RISCO',
  alertMessage = 'O resultado sugere possível manifestação de características relacionadas à Síndrome de X Frágil.',
  detailItems = [],
  onGoHome,
  onNewEvaluation,
}: ResultadoAvaliacao_FormProps) {
  const labelColor = useThemeColor({}, 'label');
  const isSuspected = screeningResult === 'SUSPEITO';

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <ResultadoAvaliacao_Header />

      <ThemedView style={formStyles.container}>
        {patientName ? (
          <ThemedText style={[formStyles.label, { color: labelColor }]}>
            PACIENTE: {patientName.toUpperCase()}
          </ThemedText>
        ) : null}

        <ResultadoAvaliacao_ScoreCard score={score} maxScore={maxScore} />

        <ResultadoAvaliacao_AlertCard
          title={isSuspected ? 'SUSPEITA DE X FRÁGIL' : 'BAIXO RISCO'}
          description={alertMessage}
          type={isSuspected ? 'warning' : 'info'}
        />

        <ThemedText style={[formStyles.label, { color: labelColor }]}>
          RECOMENDAÇÃO CLÍNICA
        </ThemedText>

        <ResultadoAvaliacao_AlertCard
          title={isSuspected ? 'ENCAMINHAMENTO INDICADO' : 'ACOMPANHAMENTO DE ROTINA'}
          description={
            isSuspected
              ? 'Exame molecular para confirmação diagnóstica. Recomenda-se referência para serviço de genética clínica para avaliação especializada.'
              : 'Continue o acompanhamento clínico de rotina. Reavalie se novos sintomas surgirem.'
          }
          type="info"
        />

        <ResultadoAvaliacao_Details items={detailItems} />

        <ResultadoAvaliacao_Actions
          onGoHome={onGoHome}
          onNewEvaluation={onNewEvaluation}
        />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingHorizontal: 24,
  },
});
