import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

export function DashboardOfflineBanner() {
return (
    <ThemedView style={styles.container}>
    <IconSymbol name="wifi.slash" size={14} color="#64748B" />
    <ThemedText style={styles.text}>Sincronizado em Modo Offline</ThemedText>
    </ThemedView>
);
}

const styles = StyleSheet.create({
container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#DDE4EE',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 12,
},
text: {
    fontSize: 13,
    color: '#64748B',
},
});