import { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LoginInput } from '@/components/loginComponents/login_input';
import { LoginButton } from '@/components/loginComponents/login_button';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type LoginFormProps = {
onSubmit: (email: string, password: string) => void;
onForgotPassword: () => void;
};

export function LoginForm({ onSubmit, onForgotPassword }: LoginFormProps) {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [passwordVisible, setPasswordVisible] = useState(false);
const colorScheme = useColorScheme();

return (
    <ThemedView lightColor="#FFFFFF" darkColor="#FFFFFF" style={styles.container}>
    <ThemedText lightColor="#64748B" darkColor="#64748B" style={styles.label}>
        E-MAIL PROFISSIONAL
    </ThemedText>
    <LoginInput
        value={email}
        onChangeText={setEmail}
        placeholder="nome@hospital.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        iconName="envelope.fill"
    />

    <ThemedView lightColor="#FFFFFF" darkColor="#FFFFFF" style={styles.passwordLabelRow}>
        <ThemedText lightColor="#64748B" darkColor="#64748B" style={styles.label}>
        SENHA
        </ThemedText>
        <TouchableOpacity onPress={onForgotPassword}>
        <ThemedText
            style={[styles.forgotText, { color: Colors[colorScheme ?? 'light'].tint }]}
        >
            Esqueci minha senha
        </ThemedText>
        </TouchableOpacity>
    </ThemedView>

    <LoginInput
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry={!passwordVisible}
        iconName="lock.fill"
        rightIconName={passwordVisible ? 'eye.slash.fill' : 'eye.fill'}
        onRightIconPress={() => setPasswordVisible(!passwordVisible)}
    />

    <LoginButton onPress={() => onSubmit(email, password)} />
    </ThemedView>
);
}

const styles = StyleSheet.create({
container: {
    gap: 6,
},
label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 14,
    marginBottom: 4,
},
passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 4,
},
forgotText: {
    fontSize: 13,
    fontWeight: '500',
},
});