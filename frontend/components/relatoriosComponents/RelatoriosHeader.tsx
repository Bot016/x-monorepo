import { HeaderActionButton } from '@/components/HeaderActionButton';
import { ScreenPageHeader } from '@/components/ScreenPageHeader';

type RelatoriosHeaderProps = {
  onExport: () => void;
  isExporting?: boolean;
  wide?: boolean;
};

export function RelatoriosHeader({
  onExport,
  isExporting = false,
  wide = false,
}: RelatoriosHeaderProps) {
  return (
    <ScreenPageHeader
      title="Relatórios e Estatísticas"
      subtitle="Análise epidemiológica e métricas de triagem."
      wide={wide}
      action={
        <HeaderActionButton
          label={isExporting ? 'Exportando...' : 'Exportar Dados'}
          icon="arrow.down.circle.fill"
          onPress={onExport}
          loading={isExporting}
          fullWidth={!wide}
        />
      }
    />
  );
}
