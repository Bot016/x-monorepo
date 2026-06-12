import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

type ChecklistHeaderProps = {
  patientName: string;
  patientAge?: number;
};

export function ChecklistHeader({ patientName, patientAge }: ChecklistHeaderProps) {
  const titleColor = useThemeColor({}, 'text');
  const subtitleColor = useThemeColor({}, 'label');
  const patientCardBackground = useThemeColor({ light: '#F5F7FA', dark: '#1F2426' }, 'iconBoxColor');
  const patientIconBackground = useThemeColor({}, 'cardBorder');

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={[styles.title, { color: titleColor }]}>
        Lista de Sintomas
      </ThemedText>
      <ThemedText style={[styles.description, { color: subtitleColor }]}>
        Avalie o presente ou passado nos sintomas abaixo com base na observação clínica e histórico do paciente.
      </ThemedText>

      <View style={[styles.patientInfo, { backgroundColor: patientCardBackground }]}>
        <View style={[styles.patientIconContainer, { backgroundColor: patientIconBackground }]}>
          <ThemedText style={styles.patientIcon}>👤</ThemedText>
        </View>
        <View style={styles.patientText}>
          <ThemedText style={[styles.patientName, { color: titleColor }]}>
            {patientName}
          </ThemedText>
          {patientAge !== undefined ? (
            <ThemedText style={[styles.patientAge, { color: subtitleColor }]}>
              {patientAge} anos
            </ThemedText>
          ) : null}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  patientIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientText: {
    flex: 1,
    gap: 2,
  },
  patientIcon: {
    fontSize: 20,
  },
  patientName: {
    fontSize: 14,
    fontWeight: '600',
  },
  patientAge: {
    fontSize: 12,
  },
});
