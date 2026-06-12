import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useState } from 'react';

import { CadastroForm } from '@/components/cadastroComponents/cadastro_form';
import { Screen } from '@/components/Screen';
import { createPatient } from '@/services/patients';
import { ageFromBirthDate, birthDateFromAge, mapBiologicalSex } from '@/utils/patient';

export default function CadastroPacienteScreen() {
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
        pathname: '/checklist-clinico',
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
    <Screen topAppBar={{ variant: 'back' }}>
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
});
