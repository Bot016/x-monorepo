import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { LoginForm } from '@/components/loginComponents/login_form';
import { LoginHeader } from '@/components/loginComponents/login_header';
import { ThemedView } from '@/components/themed-view';

export default function LoginScreen() {
const router = useRouter();

const handleLogin = (email: string, password: string) => {
    // sua lógica de autenticação aqui
    console.log('Login:', email, password);
    router.replace('/(tabs)');
};

const handleForgotPassword = () => {
    console.log('Esqueci minha senha');
};

return (
    <ThemedView style={styles.container}>
    <LoginHeader />
    <LoginForm
        onSubmit={handleLogin}
        onForgotPassword={handleForgotPassword}
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