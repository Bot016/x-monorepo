import { HeaderActionButton } from '@/components/HeaderActionButton';

type Props = {
  onPress: () => void;
  fullWidth?: boolean;
};

export function NovaAvaliacaoButton({ onPress, fullWidth = true }: Props) {
  return (
    <HeaderActionButton
      label="Nova Avaliação"
      icon="plus.circle.fill"
      onPress={onPress}
      fullWidth={fullWidth}
    />
  );
}
