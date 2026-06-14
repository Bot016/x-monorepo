import { StyleSheet, View } from 'react-native';

import { FormInput } from '@/components/ui/form-input';

type PacientesFiltersProps = {
  search: string;
  onChange: (search: string) => void;
};

export function PacientesFilters({ search, onChange }: PacientesFiltersProps) {
  return (
    <View style={styles.searchBar}>
      <FormInput
        iconName="magnifyingglass"
        placeholder="Buscar por nome"
        value={search}
        onChangeText={onChange}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        rightIconName={search ? 'xmark.circle.fill' : undefined}
        onRightIconPress={search ? () => onChange('') : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    width: '100%',
  },
});
