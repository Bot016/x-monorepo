import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { LoginForm } from '@/components/loginComponents/login_form';
import { LoginHeader } from '@/components/authComponents/auth_header';
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
    console.log('Esqueci minha senha');
  };

  return (
    <ThemedView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <LoginHeader />
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
