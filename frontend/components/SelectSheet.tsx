import { Modal, Platform, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';

import { BottomSheetFrame } from '@/components/BottomSheetFrame';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LAYOUT } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';

type SelectOption<T extends string> = {
  value: T;
  label: string;
};

type SelectSheetProps<T extends string> = {
  visible: boolean;
  title: string;
  options: SelectOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  onClose: () => void;
};

export function SelectSheet<T extends string>({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: SelectSheetProps<T>) {
  const { width } = useWindowDimensions();
  const isWebCentered = Platform.OS === 'web' && width >= LAYOUT.statsRowMinWidth;
  const borderColor = useThemeColor({}, 'cardBorder');
  const titleColor = useThemeColor({}, 'text');
  const labelColor = useThemeColor({}, 'label');
  const activeColor = useThemeColor({ light: '#1D4ED8', dark: '#60A5FA' }, 'tint');
  const handleColor = useThemeColor({ light: '#CBD5E1', dark: '#475569' }, 'inputBorder');
  const sheetBackground = useThemeColor({}, 'background');
  const optionBackground = useThemeColor(
    { light: '#F8FAFC', dark: '#1F2426' },
    'iconBoxColor',
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <BottomSheetFrame onClose={onClose} style={styles.sheet}>
        {!isWebCentered ? (
          <View style={[styles.handle, { backgroundColor: handleColor }]} />
        ) : null}
        <ThemedText style={[styles.title, { color: titleColor }]}>{title}</ThemedText>

        <View style={styles.options}>
          {options.map((option) => {
            const isSelected = option.value === selectedValue;

            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  {
                    borderColor,
                    backgroundColor: isSelected ? optionBackground : sheetBackground,
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <ThemedText
                  style={[
                    styles.optionLabel,
                    { color: isSelected ? activeColor : titleColor },
                    isSelected && styles.optionLabelSelected,
                  ]}
                >
                  {option.label}
                </ThemedText>
                {isSelected ? (
                  <IconSymbol name="checkmark.circle.fill" size={20} color={activeColor} />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.8}>
          <ThemedText style={[styles.cancelLabel, { color: labelColor }]}>Cancelar</ThemedText>
        </TouchableOpacity>
      </BottomSheetFrame>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  options: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  optionLabel: {
    fontSize: 15,
    flex: 1,
    paddingRight: 12,
  },
  optionLabelSelected: {
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },
  cancelLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
});
