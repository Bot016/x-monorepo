import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

type AlertType = 'warning' | 'danger' | 'info';

type ResultadoAvaliacaoAlertCardProps = {
  title: string;
  description: string;
  type?: AlertType;
  style?: StyleProp<ViewStyle>;
};

export function ResultadoAvaliacaoAlertCard({
  title,
  description,
  type = 'info',
  style,
}: ResultadoAvaliacaoAlertCardProps) {
  const cardBorderColor = useThemeColor({}, 'cardBorder');
  const warningBackground = useThemeColor({}, 'badgeSuspectBackground');
  const infoBackground = useThemeColor({}, 'alertInfoBackground');
  const alertDangerBorder = useThemeColor({}, 'alertDangerBorder');
  const alertWarningBorder = useThemeColor({}, 'alertWarningBorder');
  const alertInfoBorder = useThemeColor({}, 'alertInfoBorder');

  const colors = (() => {
    switch (type) {
      case 'danger':
        return {
          backgroundColor: warningBackground,
          borderColor: alertDangerBorder,
          iconColor: alertDangerBorder,
          textColor: alertDangerBorder,
        };
      case 'warning':
        return {
          backgroundColor: warningBackground,
          borderColor: alertWarningBorder,
          iconColor: alertWarningBorder,
          textColor: alertWarningBorder,
        };
      case 'info':
      default:
        return {
          backgroundColor: infoBackground,
          borderColor: alertInfoBorder,
          iconColor: alertInfoBorder,
          textColor: alertInfoBorder,
        };
    }
  })();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundColor,
          borderColor: cardBorderColor,
          borderLeftColor: colors.borderColor,
        },
        style,
      ]}
    >
      <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: colors.borderColor + '20' }]}>
          <IconSymbol
            name={type === 'danger' ? 'exclamationmark.triangle.fill' : 'exclamationmark.circle.fill'}
            size={20}
            color={colors.iconColor}
          />
        </View>

        <View style={styles.textColumn}>
          <ThemedText style={[styles.title, { color: colors.textColor }]}>{title}</ThemedText>
          <ThemedText style={[styles.description, { color: colors.textColor }]}>
            {description}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  textColumn: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
});
