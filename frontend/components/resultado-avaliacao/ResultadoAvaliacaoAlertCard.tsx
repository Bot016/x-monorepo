import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

type AlertType = 'warning' | 'danger' | 'info';

type ResultadoAvaliacaoAlertCardProps = {
  title: string;
  description: string;
  type?: AlertType;
};

export function ResultadoAvaliacaoAlertCard({
  title,
  description,
  type = 'info',
}: ResultadoAvaliacaoAlertCardProps) {
  const cardBackground = useThemeColor({}, 'background');
  const warningBackground = useThemeColor(
    { light: '#FEE2E2', dark: '#422020' },
    'background',
  );

  const colors = (() => {
    switch (type) {
      case 'danger':
        return {
          backgroundColor: warningBackground,
          borderColor: '#DC2626',
          iconColor: '#DC2626',
          textColor: '#DC2626',
        };
      case 'warning':
        return {
          backgroundColor: warningBackground,
          borderColor: '#EF4444',
          iconColor: '#EF4444',
          textColor: '#EF4444',
        };
      case 'info':
      default:
        return {
          backgroundColor: cardBackground,
          borderColor: '#005EB8',
          iconColor: '#005EB8',
          textColor: '#005EB8',
        };
    }
  })();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.borderColor + '20' }]}>
          <IconSymbol
            name={type === 'danger' ? 'exclamationmark.triangle.fill' : 'exclamationmark.circle.fill'}
            size={20}
            color={colors.iconColor}
          />
        </View>
        <ThemedText style={[styles.title, { color: colors.textColor }]}>{title}</ThemedText>
      </View>
      <ThemedText style={[styles.description, { color: colors.textColor }]}>
        {description}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 12,
    gap: 8,
    borderLeftWidth: 4,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 52,
  },
});
