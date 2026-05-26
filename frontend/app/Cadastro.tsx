import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function CadastroScreen() {
  const theme = useColorScheme() ?? 'light';
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const buttonColor = useThemeColor({}, 'buttonColor');
  const placeholderTextColor = useThemeColor({}, 'placeholderTextColor');
  const inputBackgroundColor = Colors[theme].background;
  const inputBorderColor = Colors[theme].icon;

  return (
    <ThemedView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <ThemedText type="title" style={styles.title}>
            Cadastro
          </ThemedText>

          <View style={styles.field}>
            <ThemedText type="subtitle">Nome</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: textColor }]}
              placeholder="Digite seu nome"
              placeholderTextColor={placeholderTextColor}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.field}>
            <ThemedText type="subtitle">Email</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: textColor }]}
              placeholder="Digite seu email"
              placeholderTextColor={placeholderTextColor}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.field}>
            <ThemedText type="subtitle">Senha</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: textColor }]}
              placeholder="Digite sua senha"
              placeholderTextColor={placeholderTextColor}
              secureTextEntry
            />
          </View>

          <View style={styles.field}>
            <ThemedText type="subtitle">Confirmar senha</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: textColor }]}
              placeholder="Digite a senha novamente"
              placeholderTextColor={placeholderTextColor}
              secureTextEntry
            />
          </View>

          <Pressable style={[styles.button, { backgroundColor: buttonColor }]}> 
            <ThemedText style={styles.buttonText}>Enviar cadastro</ThemedText>
          </Pressable>

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
    padding: 24,
    gap: 16,
  },
  title: {
    marginBottom: 8,
  },
  field: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  successText: {
    marginTop: 16,
    color: '#0a7ea4',
  },
});
