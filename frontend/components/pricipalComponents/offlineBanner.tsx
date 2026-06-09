import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { DashboardSyncStatus } from '@/services/dashboard';

type DashboardOfflineBannerProps = {
  status: DashboardSyncStatus;
  message?: string | null;
};

export function DashboardOfflineBanner({ status, message }: DashboardOfflineBannerProps) {
  if (status === 'synced') {
    return null;
  }

  const isLoading = status === 'loading';

  return (
    <ThemedView style={styles.container}>
      <IconSymbol
        name={isLoading ? 'arrow.clockwise' : 'wifi.slash'}
        size={14}
        color="#64748B"
      />
      <ThemedText style={styles.text}>
        {isLoading
          ? 'Sincronizando dados...'
          : (message ?? 'Não foi possível sincronizar com o servidor.')}
      </ThemedText>
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