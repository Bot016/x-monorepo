import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';

import { ResultadoAvaliacaoForm } from '@/components/resultado-avaliacao/ResultadoAvaliacaoForm';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { ScreeningResult } from '@/services/types/api';
import { loadEvaluationResult } from '@/utils/evaluationResult';

type ResultadoAvaliacaoParams = {
  patientName?: string;
  score?: string;
  screeningResult?: ScreeningResult;
  appliedThreshold?: string;
  evaluationId?: string;
  patientId?: string;
};

export default function ResultadoAvaliacaoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<ResultadoAvaliacaoParams>();
  const errorColor = useThemeColor({}, 'error');

  const [isLoading, setIsLoading] = useState(Boolean(params.evaluationId || params.patientId));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadedResult, setLoadedResult] = useState<{
    patientName: string;
    score: number;
    screeningResult: ScreeningResult;
    appliedThreshold: number;
  } | null>(null);

  useEffect(() => {
    if (!params.evaluationId && !params.patientId) {
      return;
    }

    let isMounted = true;

    setIsLoading(true);
    setErrorMessage(null);

    loadEvaluationResult({
      evaluationId: params.evaluationId,
      patientId: params.patientId,
    })
      .then((result) => {
        if (isMounted) setLoadedResult(result);
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar o resultado da avaliação.',
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [params.evaluationId, params.patientId]);

  const score = loadedResult?.score ?? Number.parseFloat(params.score ?? '0');
  const appliedThreshold =
    loadedResult?.appliedThreshold ?? Number.parseFloat(params.appliedThreshold ?? '0');
  const patientName = loadedResult?.patientName ?? params.patientName;
  const screeningResult = loadedResult?.screeningResult ?? params.screeningResult;
  const isSuspected = screeningResult === 'suspected';

  if (isLoading) {
    return (
      <Screen topAppBar style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Carregando resultado...</ThemedText>
      </Screen>
    );
  }

  if (errorMessage) {
    return (
      <Screen topAppBar style={styles.centered}>
        <ThemedText style={[styles.error, { color: errorColor }]}>{errorMessage}</ThemedText>
      </Screen>
    );
  }

  return (
    <Screen topAppBar>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ResultadoAvaliacaoForm
          patientName={patientName}
          score={score}
          maxScore={1}
          screeningResult={screeningResult}
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 14,
    opacity: 0.7,
  },
  error: {
    fontSize: 15,
    textAlign: 'center',
  },
});
