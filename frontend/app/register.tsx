import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { AuthHeader } from '@/components/authComponents/auth_header';
import { RegisterForm } from '@/components/authComponents/registerComponents/register_form';
import { ThemedView } from '@/components/themed-view';

export default function CadastroScreen() {
  const handleRegister = (name: string, email: string, password: string, confirmPassword: string) => {
    Alert.alert('Cadastro', `Nome: ${name}\nEmail: ${email}\nSenha: ${password}\nConfirmar: ${confirmPassword}`);
  };

  return (
    <ThemedView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <AuthHeader />
          <RegisterForm onSubmit={handleRegister} />
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
