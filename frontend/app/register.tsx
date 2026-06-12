import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Screen } from '@/components/Screen';
import { AuthHeader } from '@/components/authComponents/auth_header';
import { AuthScreenLayout } from '@/components/authComponents/auth_screen_layout';
import { RegisterForm } from '@/components/authComponents/registerComponents/register_form';
import { useAuth } from '@/hooks/useAuth';
import { AuthError } from '@/services/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isRegistering } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    try {
      await register({ name, email, password });
    } catch (error) {
      if (error instanceof AuthError) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage('Não foi possível concluir o cadastro. Tente novamente.');
    }
  };

  return (
    <Screen>
      <AuthScreenLayout>
        <AuthHeader subtitle="Cadastro" />
        <RegisterForm
          onSubmit={handleRegister}
          onGoToLogin={() => router.push('/login')}
          isLoading={isRegistering}
          errorMessage={errorMessage}
        />
      </AuthScreenLayout>
    </Screen>
  );
}
