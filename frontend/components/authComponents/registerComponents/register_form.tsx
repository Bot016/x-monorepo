import { useState } from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AuthDivider } from '@/components/authComponents/auth_divider';
import { AuthOutlineButton } from '@/components/authComponents/auth_outline_button';
import { formStyles } from '@/components/authComponents/formStyles';
import { FormButton } from '@/components/ui/form-button';
import { FormInput } from '@/components/ui/form-input';
import { useThemeColor } from '@/hooks/use-theme-color';

type RegisterFormProps = {
  onSubmit: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => void | Promise<void>;
  onGoToLogin: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
};

export function RegisterForm({
  onSubmit,
  onGoToLogin,
  isLoading = false,
  errorMessage = null,
}: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const placeholderTextColor = useThemeColor({}, 'placeholderTextColor');
  const labelColor = useThemeColor({}, 'label');
  const errorColor = useThemeColor({}, 'error');

  return (
    <View style={formStyles.container}>
      <ThemedText style={[formStyles.label, { color: labelColor }]}>
        NOME
      </ThemedText>
      <FormInput
        value={name}
        onChangeText={setName}
        placeholder="Digite seu nome"
        placeholderTextColor={placeholderTextColor}
        autoCapitalize="words"
        iconName="person.fill"
      />

      <ThemedText style={[formStyles.label, { color: labelColor }]}>
        E-MAIL PROFISSIONAL
      </ThemedText>
      <FormInput
        value={email}
        onChangeText={setEmail}
        placeholder="nome@hospital.com"
        placeholderTextColor={placeholderTextColor}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        iconName="envelope.fill"
      />

      <ThemedText style={[formStyles.label, { color: labelColor }]}>
        SENHA
      </ThemedText>
      <FormInput
        value={password}
        onChangeText={setPassword}
        placeholder="Digite sua senha"
        placeholderTextColor={placeholderTextColor}
        secureTextEntry
        iconName="lock.fill"
      />

      <ThemedText style={[formStyles.label, { color: labelColor }]}>
        CONFIRMAR SENHA
      </ThemedText>
      <FormInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Digite a senha novamente"
        placeholderTextColor={placeholderTextColor}
        secureTextEntry
        iconName="lock.fill"
      />

      {errorMessage ? (
        <ThemedText style={[formStyles.errorText, { color: errorColor }]}>
          {errorMessage}
        </ThemedText>
      ) : null}

      <View style={formStyles.actionsSection}>
        <FormButton
          onPress={() => void onSubmit(name, email, password, confirmPassword)}
          disabled={isLoading}
          label={isLoading ? 'Cadastrando...' : 'Cadastrar'}
          grouped
        />
        <AuthDivider />
        <AuthOutlineButton label="Entrar" onPress={onGoToLogin} />
      </View>
    </View>
  );
}
