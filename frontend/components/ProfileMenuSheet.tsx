import { ActivityIndicator, Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getUserInitials } from '@/utils/user';

type ProfileMenuSheetProps = {
  visible: boolean;
  name?: string;
  email?: string;
  isLoggingOut?: boolean;
  onClose: () => void;
  onLogout: () => void;
};

export function ProfileMenuSheet({
  visible,
  name,
  email,
  isLoggingOut = false,
  onClose,
  onLogout,
}: ProfileMenuSheetProps) {
  const insets = useSafeAreaInsets();
  const sheetBackground = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'cardBorder');
  const titleColor = useThemeColor({}, 'text');
  const labelColor = useThemeColor({}, 'label');
  const avatarBackground = useThemeColor({}, 'iconBoxColor');
  const avatarTextColor = useThemeColor({}, 'iconColor');
  const avatarBorderColor = useThemeColor({}, 'inputBorder');
  const logoutBackground = useThemeColor({}, 'error');
  const logoutTextColor = useThemeColor({}, 'onPrimary');
  const handleColor = useThemeColor({ light: '#CBD5E1', dark: '#475569' }, 'inputBorder');

  const displayName = name?.trim() || 'Profissional';
  const displayEmail = email?.trim() || '—';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Fechar menu" />

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: sheetBackground,
              borderTopColor: borderColor,
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: handleColor }]} />

          <View
            style={[
              styles.avatar,
              {
                borderColor: avatarBorderColor,
                backgroundColor: avatarBackground,
              },
            ]}
          >
            <ThemedText style={[styles.initials, { color: avatarTextColor }]}>
              {getUserInitials(name)}
            </ThemedText>
          </View>

          <ThemedText style={[styles.name, { color: titleColor }]}>{displayName}</ThemedText>
          <ThemedText style={[styles.email, { color: labelColor }]}>{displayEmail}</ThemedText>

          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: logoutBackground }]}
            onPress={onLogout}
            activeOpacity={0.85}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator color={logoutTextColor} />
            ) : (
              <ThemedText style={[styles.logoutLabel, { color: logoutTextColor }]}>
                Sair da conta
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sheet: {
    borderTopWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: 'center',
    gap: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  initials: {
    fontSize: 24,
    fontWeight: '700',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  logoutButton: {
    alignSelf: 'stretch',
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  logoutLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
});
