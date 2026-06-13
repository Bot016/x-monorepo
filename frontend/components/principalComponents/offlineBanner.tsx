import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { DashboardSyncStatus } from '@/services/dashboard';

type DashboardOfflineBannerProps = {
  status: DashboardSyncStatus;
  message?: string | null;
};

export function DashboardOfflineBanner({ status, message }: DashboardOfflineBannerProps) {
  const badgeBackground = useThemeColor({ light: '#F1F5F9', dark: '#2A3036' }, 'iconBoxColor');
  const badgeTextColor = useThemeColor({}, 'label');

  if (status === 'synced') {
    return null;
  }

  const isLoading = status === 'loading';

  return (
    <View style={[styles.badge, { backgroundColor: badgeBackground }]}>
      <IconSymbol
        name={isLoading ? 'arrow.clockwise' : 'wifi.slash'}
        size={11}
        color={badgeTextColor}
      />
      <ThemedText style={[styles.text, { color: badgeTextColor }]}>
        {isLoading
          ? 'Sincronizando dados...'
          : (message ?? 'Não foi possível sincronizar com o servidor.')}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
