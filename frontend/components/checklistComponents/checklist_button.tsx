import { FormButton } from '@/components/ui/form-button';

type ChecklistButtonProps = {
  onPress: () => void;
  label?: string;
  disabled?: boolean;
};

export function ChecklistButton({
  onPress,
  label = 'Finalizar Avaliação',
  disabled = false,
}: ChecklistButtonProps) {
  return <FormButton onPress={onPress} label={label} disabled={disabled} />;
}
