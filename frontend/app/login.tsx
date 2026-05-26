import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { LoginForm } from '@/components/loginComponents/login_form';
import { LoginHeader } from '@/components/loginComponents/login_header';

export default function LoginScreen() {
const router = useRouter();

const handleLogin = (email: string, password: string) => {
    console.log('Login:', email, password);
    router.replace('/(tabs)');
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