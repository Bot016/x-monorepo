import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useState } from 'react';

import { CadastroForm } from '@/components/cadastroComponents/cadastro_form';
import { ThemedView } from '@/components/themed-view';
import { createPatient } from '@/services/patients';
import { ageFromBirthDate, birthDateFromAge, mapBiologicalSex } from '@/utils/patient';

export default function CadastroScreen() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCadastro = async (
    nomeCompleto: string,
    idade: string,
    sexoBiologico: string,
    nomeResponsavel: string,
  ) => {
    setErrorMessage(null);

    try {
      setIsLoading(true);

      const patient = await createPatient({
        name: nomeCompleto.trim(),
        sex: mapBiologicalSex(sexoBiologico),
        birthDate: birthDateFromAge(idade),
        ...(nomeResponsavel.trim()
          ? { guardian: { name: nomeResponsavel.trim() } }
          : {}),
      });

      router.push({
        pathname: '/checklistClinico',
        params: {
          patientId: patient.id,
          patientName: patient.name,
          patientAge: String(ageFromBirthDate(patient.birthDate)),
          sex: patient.sex,
        },
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível completar o cadastro. Tente novamente.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <CadastroForm
          onSubmit={handleCadastro}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
});
