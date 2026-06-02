import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { RegisterInput } from '@/components/authComponents/registerComponents/register_input';
import { RegisterButton } from '@/components/authComponents/registerComponents/register_button';
import { useThemeColor } from '@/hooks/use-theme-color';

type RegisterFormProps = {
  onSubmit: (name: string, email: string, password: string, confirmPassword: string) => void;
};

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const placeholderTextColor = useThemeColor({}, 'placeholderTextColor');

  return (
    <ThemedView lightColor="#FFFFFF" darkColor="#FFFFFF" style={styles.container}>
      <ThemedText lightColor="#64748B" darkColor="#64748B" style={styles.label}>
        NOME
      </ThemedText>
      <RegisterInput
        value={name}
        onChangeText={setName}
        placeholder="Digite seu nome"
        placeholderTextColor={placeholderTextColor}
        autoCapitalize="words"
        iconName="person.fill"
      />

      <ThemedText lightColor="#64748B" darkColor="#64748B" style={styles.label}>
        E-MAIL PROFISSIONAL
      </ThemedText>
      <RegisterInput
        value={email}
        onChangeText={setEmail}
        placeholder="nome@hospital.com"
        placeholderTextColor={placeholderTextColor}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        iconName="envelope.fill"
      />

      <ThemedText lightColor="#64748B" darkColor="#64748B" style={styles.label}>
        SENHA
      </ThemedText>
      <RegisterInput
        value={password}
        onChangeText={setPassword}
        placeholder="Digite sua senha"
        placeholderTextColor={placeholderTextColor}
        secureTextEntry
        iconName="lock.fill"
      />

      <ThemedText lightColor="#64748B" darkColor="#64748B" style={styles.label}>
        CONFIRMAR SENHA
      </ThemedText>
      <RegisterInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Digite a senha novamente"
        placeholderTextColor={placeholderTextColor}
        secureTextEntry
        iconName="lock.fill"
      />

      <RegisterButton onPress={() => onSubmit(name, email, password, confirmPassword)} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 14,
    marginBottom: 4,
  },
});
