import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { LoginForm } from '@/components/authComponents/loginComponents/login_form';
import { LoginHeader } from '@/components/authComponents/auth_header';

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
        <View style={styles.container}>
        <LoginHeader />
        <LoginForm
            onSubmit={handleLogin}
            onForgotPassword={handleForgotPassword}
        />
        </View>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
},
});