import type { SymptomCategory } from '@/services/types/api';

export const SYMPTOM_CATEGORY_STEPS: Array<{
  key: SymptomCategory;
  title: string;
  description: string;
}> = [
  {
    key: 'behavioral',
    title: 'Comportamento',
    description: 'Avalie sintomas relacionados ao comportamento e interação social.',
  },
  {
    key: 'cognitive',
    title: 'Cognição',
    description: 'Avalie sintomas relacionados ao aprendizado e desenvolvimento cognitivo.',
  },
  {
    key: 'physical',
    title: 'Características Físicas',
    description: 'Avalie características físicas e fenotípicas observadas.',
  },
];
