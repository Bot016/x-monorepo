import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

type AuthInfoModalProps = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
};

export function AuthInfoModal({ visible, title, message, onClose }: AuthInfoModalProps) {
  const cardBackground = useThemeColor({}, 'background');
  const titleColor = useThemeColor({}, 'text');
  const messageColor = useThemeColor({}, 'label');
  const buttonColor = useThemeColor({}, 'buttonColor');
  const buttonTextColor = useThemeColor({}, 'onPrimary');
  const overlayColor = useThemeColor({}, 'overlay');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable
          style={[styles.backdrop, { backgroundColor: overlayColor }]}
          onPress={onClose}
          accessibilityLabel="Fechar"
        />

        <View style={[styles.card, { backgroundColor: cardBackground }]}>
          <ThemedText style={[styles.title, { color: titleColor }]}>{title}</ThemedText>
          <ThemedText style={[styles.message, { color: messageColor }]}>{message}</ThemedText>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: buttonColor }]}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <ThemedText style={[styles.buttonLabel, { color: buttonTextColor }]}>Entendi</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 12,
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  button: {
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
});
