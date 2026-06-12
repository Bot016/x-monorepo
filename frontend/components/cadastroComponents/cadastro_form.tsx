import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { ScreenContent } from '@/components/ScreenContent';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LAYOUT } from '@/constants/layout';
import { CadastroHeader } from '@/components/cadastroComponents/cadastro_header';
import { BiologicoSelector } from '@/components/cadastroComponents/biologico_selector';
import { FormButton } from '@/components/ui/form-button';
import { FormInput } from '@/components/ui/form-input';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formStyles } from '@/components/authComponents/formStyles';

type CadastroFormProps = {
  onSubmit: (
    nomeCompleto: string,
    idade: string,
    sexoBiologico: string,
    nomeResponsavel: string
  ) => void | Promise<void>;
  isLoading?: boolean;
  errorMessage?: string | null;
};

export function CadastroForm({
  onSubmit,
  isLoading = false,
  errorMessage = null,
}: CadastroFormProps) {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [idade, setIdade] = useState('');
  const [sexoBiologico, setSexoBiologico] = useState('');
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const labelColor = useThemeColor({}, 'label');
  const errorColor = useThemeColor({}, 'error');

  const isFormValid = () => {
    return (
      nomeCompleto.trim() !== '' &&
      idade.trim() !== '' &&
      sexoBiologico !== ''
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <ScreenContent maxWidth={LAYOUT.formMaxWidth} style={styles.form}>
        <CadastroHeader step={1} totalSteps={4} />

        <ThemedView style={formStyles.container}>
        <ThemedText style={[formStyles.label, { color: labelColor }]}>
          NOME COMPLETO
        </ThemedText>
        <FormInput
          placeholder="Digite o nome completo"
          value={nomeCompleto}
          onChangeText={setNomeCompleto}
          autoCapitalize="words"
          iconName="person.fill"
        />

        <ThemedText style={[formStyles.label, { color: labelColor }]}>
          IDADE
        </ThemedText>
        <FormInput
          placeholder="Ex: 8"
          keyboardType="numeric"
          value={idade}
          onChangeText={setIdade}
        />

        <ThemedText style={[formStyles.label, { color: labelColor }]}>
          SEXO BIOLÓGICO
        </ThemedText>
        <BiologicoSelector
          value={sexoBiologico}
          onChange={setSexoBiologico}
        />

        <ThemedText style={[formStyles.label, { color: labelColor }]}>
          NOME DO RESPONSÁVEL
        </ThemedText>
        <FormInput
          placeholder="Nome do pai, mãe ou tutor"
          value={nomeResponsavel}
          onChangeText={setNomeResponsavel}
          autoCapitalize="words"
          iconName="person.fill"
        />

        {errorMessage ? (
          <ThemedText style={[formStyles.errorText, { color: errorColor }]}>
            {errorMessage}
          </ThemedText>
        ) : null}

        <FormButton
          label={isLoading ? 'Salvando...' : 'Ir para Checklist'}
          onPress={() =>
            void onSubmit(nomeCompleto, idade, sexoBiologico, nomeResponsavel)
          }
          disabled={!isFormValid() || isLoading}
        />
        </ThemedView>
      </ScreenContent>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    paddingHorizontal: 40,
  },
  form: {
    gap: 20,
  },
});
