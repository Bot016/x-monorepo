import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { AuthHeader } from '@/components/authComponents/auth_header';
import { LoginForm } from '@/components/authComponents/login_form';
import { useAuth } from '@/hooks/useAuth';
import { AuthError } from '@/services/auth';
import { ThemedView } from '@/components/themed-view';

export default function LoginScreen() {
  const { signIn, isSigningIn } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setErrorMessage(null);

    try {
      await signIn({ email, password });
    } catch (error) {
      if (error instanceof AuthError) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage('Não foi possível entrar. Tente novamente.');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperação de senha',
      'Entre em contato com o administrador do sistema para redefinir sua senha.',
    );
  };

  return (
    <ThemedView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <AuthHeader />
          <LoginForm
            onSubmit={handleLogin}
            onForgotPassword={handleForgotPassword}
            isLoading={isSigningIn}
            errorMessage={errorMessage}
          />
        </ScrollView>
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
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingHorizontal: 40,
    gap: 20,
  },
});
