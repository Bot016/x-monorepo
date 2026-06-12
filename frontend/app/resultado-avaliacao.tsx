import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

import { ResultadoAvaliacaoForm } from '@/components/resultado-avaliacao/ResultadoAvaliacaoForm';
import { ThemedView } from '@/components/themed-view';
import type { ScreeningResult } from '@/services/types/api';

export default function ResultadoAvaliacaoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    patientName?: string;
    score?: string;
    screeningResult?: ScreeningResult;
    appliedThreshold?: string;
  }>();

  const score = Number.parseFloat(params.score ?? '0');
  const appliedThreshold = Number.parseFloat(params.appliedThreshold ?? '0');
  const isSuspected = params.screeningResult === 'SUSPEITO';

  return (
    <ThemedView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ResultadoAvaliacaoForm
          patientName={params.patientName}
          score={score}
          maxScore={1}
          screeningResult={params.screeningResult}
          alertMessage={
            isSuspected
              ? 'O resultado sugere possível manifestação de características relacionadas à Síndrome de X Frágil.'
              : 'O resultado indica baixo risco para Síndrome de X Frágil com base nos sintomas avaliados.'
          }
          detailItems={[
            { label: 'Score final', value: score.toFixed(2) },
            { label: 'Limiar aplicado', value: appliedThreshold.toFixed(3) },
          ]}
          onGoHome={() => router.replace('/(tabs)')}
          onNewEvaluation={() => router.replace('/cadastro-paciente')}
        />
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  keyboard: { flex: 1 },
});
