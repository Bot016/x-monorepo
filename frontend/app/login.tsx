import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { LoginForm } from '@/components/loginComponents/login_form';
import { LoginHeader } from '@/components/loginComponents/login_header';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/providers/AuthProvider';
import { AuthError } from '@/services/auth';

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
    <ThemedView lightColor="#FFFFFF" darkColor="#FFFFFF" style={styles.container}>
      <LoginHeader />
      <LoginForm
        onSubmit={handleLogin}
        onForgotPassword={handleForgotPassword}
        isLoading={isSigningIn}
        errorMessage={errorMessage}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
  },
});
