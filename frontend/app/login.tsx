import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Screen } from '@/components/Screen';
import { AuthHeader } from '@/components/authComponents/auth_header';
import { AuthScreenLayout } from '@/components/authComponents/auth_screen_layout';
import { LoginForm } from '@/components/authComponents/login_form';
import { useAuth } from '@/hooks/useAuth';
import { AuthError } from '@/services/auth';

export default function LoginScreen() {
  const router = useRouter();
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

  return (
    <Screen>
      <AuthScreenLayout>
        <AuthHeader subtitle="Login" />
        <LoginForm
          onSubmit={handleLogin}
          onGoToRegister={() => router.push('/register')}
          isLoading={isSigningIn}
          errorMessage={errorMessage}
        />
      </AuthScreenLayout>
    </Screen>
  );
}
