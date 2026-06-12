import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';

import { ChecklistButton } from '@/components/checklistComponents/checklist_button';
import { ChecklistHeader } from '@/components/checklistComponents/checklist_header';
import { ChecklistItem } from '@/components/checklistComponents/checklist_item';
import { ChecklistSection } from '@/components/checklistComponents/checklist_section';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SYMPTOM_CATEGORY_STEPS } from '@/constants/symptomCategories';
import { useThemeColor } from '@/hooks/use-theme-color';
import { createEvaluation } from '@/services/evaluations';
import { fetchSymptoms } from '@/services/symptoms';
import type { PatientSex, SymptomDto } from '@/services/types/api';

export default function ChecklistClinicoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    patientId: string;
    patientName: string;
    patientAge: string;
    sex: PatientSex;
  }>();

  const [symptoms, setSymptoms] = useState<SymptomDto[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Record<string, boolean>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoadingSymptoms, setIsLoadingSymptoms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const errorColor = useThemeColor({}, 'error');

  const patientId = params.patientId;
  const patientName = params.patientName ?? 'Paciente';
  const patientAge = Number.parseInt(params.patientAge ?? '0', 10);
  const sex = params.sex === 'f' ? 'f' : 'm';

  useEffect(() => {
    let isMounted = true;

    fetchSymptoms(sex)
      .then((items) => {
        if (isMounted) setSymptoms(items);
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar os sintomas.',
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingSymptoms(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sex]);

  const currentCategory = SYMPTOM_CATEGORY_STEPS[currentStep];
  const stepSymptoms = useMemo(
    () => symptoms.filter((symptom) => symptom.category === currentCategory.key),
    [symptoms, currentCategory.key],
  );

  const handleToggleSymptom = (id: string) => {
    setSelectedSymptoms((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  const handleContinue = async () => {
    setErrorMessage(null);

    if (currentStep < SYMPTOM_CATEGORY_STEPS.length - 1) {
      setCurrentStep((previous) => previous + 1);
      return;
    }

    if (!patientId) {
      setErrorMessage('Paciente inválido. Reinicie o cadastro.');
      return;
    }

    setIsSubmitting(true);

    try {
      const evaluation = await createEvaluation({
        patientId,
        sintomas: symptoms.map((symptom) => ({
          id: symptom.id,
          presente: selectedSymptoms[symptom.id] ?? false,
        })),
      });

      router.replace({
        pathname: '/resultado-avaliacao',
        params: {
          patientName,
          score: String(evaluation.score),
          screeningResult: evaluation.screeningResult,
          appliedThreshold: String(evaluation.appliedThreshold),
        },
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível finalizar a avaliação.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingSymptoms) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Carregando sintomas...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ThemedText style={styles.stepLabel}>
          PASSO {currentStep + 2} DE 4
        </ThemedText>

        <ChecklistHeader
          patientName={patientName}
          patientAge={Number.isNaN(patientAge) ? undefined : patientAge}
        />

        <ChecklistSection
          title={currentCategory.title}
          description={currentCategory.description}
        >
          {stepSymptoms.map((symptom) => (
            <ChecklistItem
              key={symptom.id}
              id={symptom.id}
              label={symptom.symptomName}
              checked={selectedSymptoms[symptom.id] ?? false}
              onPress={handleToggleSymptom}
            />
          ))}
        </ChecklistSection>

        {errorMessage ? (
          <ThemedText style={[styles.error, { color: errorColor }]}>{errorMessage}</ThemedText>
        ) : null}

        <ChecklistButton
          label={
            isSubmitting
              ? 'Finalizando...'
              : currentStep < SYMPTOM_CATEGORY_STEPS.length - 1
                ? 'Próxima etapa'
                : 'Finalizar Avaliação'
          }
          onPress={() => void handleContinue()}
          disabled={isSubmitting || stepSymptoms.length === 0}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
    gap: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    opacity: 0.7,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  error: {
    fontSize: 14,
  },
});
