import type { ReportFilters } from './types';
import { fetchReportPdfBuffer } from './exportReportPdf.shared';

function downloadPdfOnWeb(buffer: ArrayBuffer): void {
  const blob = new Blob([buffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'relatorio.pdf';
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function exportReportPdf(filters: ReportFilters): Promise<void> {
  const buffer = await fetchReportPdfBuffer(filters);
  downloadPdfOnWeb(buffer);
}
